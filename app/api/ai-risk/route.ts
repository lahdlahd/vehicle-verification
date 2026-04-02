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
          content: `You are an expert automotive risk analyst and vehicle advisor. 
You have access to a specific vehicle's record and you answer buyer questions honestly and directly.
Always tailor your response to the exact question asked — do not follow a rigid format.
If the question is about the specific vehicle, use its data to answer.
If the question is general (like budget advice), answer it naturally as a car expert would.
Be conversational, helpful, and concise.`,
        },
        {
          role: "user",
          content: `Vehicle Record:
- VIN: ${vin}
- Status: ${status.replace(/_/g, " ").toUpperCase()}
- History: ${description}

Buyer's Question: ${question}`,
        },
      ],
      max_tokens: 1024,
      temperature: 0.8,
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