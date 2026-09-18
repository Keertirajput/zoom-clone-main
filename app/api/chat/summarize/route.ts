import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const transcript = body?.transcript;

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        {
          error: 'Meeting transcript is required',
        },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            'OPENAI_API_KEY is missing. Please add it to your .env file.',
        },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',

      messages: [
        {
          role: 'system',
          content:
            'You are an AI meeting assistant. Summarize the meeting transcript clearly and concisely. Include the main topics discussed, important points, decisions, and action items. Use simple headings and bullet points.',
        },
        {
          role: 'user',
          content: `Please summarize this meeting transcript:

${transcript}`,
        },
      ],

      temperature: 0.3,
    });

    const summary =
      completion.choices[0]?.message?.content;

    if (!summary) {
      return NextResponse.json(
        {
          error: 'AI could not generate a summary.',
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
            : 'Failed to generate meeting summary',
      },
      { status: 500 }
    );
  }
}