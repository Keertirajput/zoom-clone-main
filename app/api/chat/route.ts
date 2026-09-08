import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Tried in order. If one is unavailable (404) or overloaded (503/429) we
// fall back to the next. These are current Groq text models.
const GROQ_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

// Status codes worth retrying on the same model (transient / overload).
const RETRYABLE = new Set([429, 500, 502, 503]);
// Status codes that mean "this model won't work, move to the next one".
const TRY_NEXT_MODEL = new Set([404, 429, 500, 502, 503]);

const SYSTEM_PROMPT =
  'You are YOOM Assistant, a friendly and concise AI helper embedded in a video meeting app. Help users with meetings, scheduling ideas, quick questions, and general assistance. Keep answers clear and to the point.';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGroq(
  model: string,
  apiKey: string,
  messages: { role: string; content: string }[],
): Promise<{ ok: true; reply: string } | { ok: false; status: number }> {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Groq API error (${model}):`, res.status, errText);
    return { ok: false, status: res.status };
  }

  const data = await res.json();
  const reply: string = (data?.choices?.[0]?.message?.content || '').trim();
  return { ok: true, reply };
}

export async function POST(req: Request) {
  // Only signed-in users can use the assistant.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'The AI assistant is not configured. Add GROQ_API_KEY to your .env file.',
      },
      { status: 500 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const history = Array.isArray(body.messages) ? body.messages : [];
  if (history.length === 0) {
    return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
  }

  // Build the OpenAI-compatible message list: system prompt + conversation.
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history
      .filter((m) => m && typeof m.content === 'string' && m.content.trim())
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
  ];

  let lastStatus = 0;

  try {
    for (const model of GROQ_MODELS) {
      for (let attempt = 0; attempt < 3; attempt++) {
        const result = await callGroq(model, apiKey, messages);

        if (result.ok) {
          if (result.reply) {
            return NextResponse.json({ reply: result.reply });
          }
          lastStatus = 502; // empty reply, don't retry this model
          break;
        }

        lastStatus = result.status;

        // 404 -> model gone, jump straight to next model.
        if (result.status === 404) break;

        // Non-retryable (401 bad key, 400 bad request, etc.) -> stop.
        if (!RETRYABLE.has(result.status)) break;

        // Retryable: short backoff before next attempt (0.6s, 1.2s).
        if (attempt < 2) await sleep(600 * (attempt + 1));
      }

      // Hard error (auth / bad request) -> don't try other models.
      if (lastStatus && !TRY_NEXT_MODEL.has(lastStatus)) break;
    }

    if (lastStatus === 401 || lastStatus === 403) {
      return NextResponse.json(
        { error: 'The AI API key is invalid or unauthorized.' },
        { status: 502 },
      );
    }

    if (lastStatus === 429) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a moment and try again.' },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: 'The AI did not return a response. Please try again.' },
      { status: 502 },
    );
  } catch (error) {
    console.error('Chat route error:', error);
    return NextResponse.json(
      { error: 'Something went wrong reaching the AI service.' },
      { status: 500 },
    );
  }
}
