import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GROQ_ENDPOINT =
  'https://api.groq.com/openai/v1/chat/completions';

const GROQ_MODEL = 'openai/gpt-oss-120b';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const transcript = body?.transcript;

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        {
          error: 'Meeting transcript is required.',
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'GROQ_API_KEY is missing. Please add it to your .env file.',
        },
        { status: 500 }
      );
    }

    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content:
              'You are an AI meeting assistant. Summarize meeting transcripts clearly and concisely. Include: 1. Main topics, 2. Important points, 3. Decisions, and 4. Action items. Use simple headings and bullet points.',
          },
          {
            role: 'user',
            content: `Please summarize this meeting transcript:

${transcript}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1200,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq Summary Error:', data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            'Groq failed to generate the meeting summary.',
        },
        { status: response.status }
      );
    }

    const summary =
      data?.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json(
        {
          error: 'AI could not generate a meeting summary.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      summary,
    });
  } catch (error) {
    console.error('Meeting summary error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate meeting summary.',
      },
      { status: 500 }
    );
  }
}