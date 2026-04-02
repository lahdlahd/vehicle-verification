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

    const prompt = `You are an expert automotive risk analyst helping a car buyer make an informed decision.

Vehicle Record:
- VIN: ${vin}
- Status: ${status.replace("_", " ").toUpperCase()}
- History: ${description}

Buyer's Question: ${question}

Please provide:
1. **Risk Assessment**: Overall risk level and what it means
2. **Safety Concerns**: Specific safety issues to be aware of
3. **Maintenance Expectations**: What the buyer should expect to spend/fix
4. **Recommendation**: Should they buy this vehicle or not, and why

Be direct, factual, and helpful. Keep each section to 2-3 sentences.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert automotive risk analyst and vehicle safety advisor. Be direct, factual, and helpful.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
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