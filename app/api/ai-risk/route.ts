import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { vin, status, description, question } = await request.json();

    if (!vin || !status || !description || !question) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful and knowledgeable car buying advisor.
STRICT RULES:
- Answer ONLY the exact question the user asked. Nothing else.
- If asked about budget (e.g. "$1000"), give general car buying advice for that budget. Ignore the vehicle record.
- If asked about THIS specific vehicle, use the vehicle record to answer.
- If asked about safety, talk about safety only.
- If asked about repair costs, estimate costs only.
- NEVER use the same format or structure twice.
- Be conversational, direct, and helpful.
- Keep responses under 150 words.`,
        },
        {
          role: "user",
          content: `Vehicle on record:
- VIN: ${vin}
- Status: ${status.replace(/_/g, " ").toUpperCase()}
- History: ${description}

My question: ${question}`,
        },
      ],
      max_tokens: 512,
      temperature: 0.9,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("AI risk analysis error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}