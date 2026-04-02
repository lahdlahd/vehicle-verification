import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

    const systemPrompt = `You are an expert automotive risk analyst and vehicle safety advisor. 
You analyze vehicle history records and provide clear, honest assessments to help buyers make informed decisions.
You have access to a vehicle's VIN, status, and history description.
Always be direct, factual, and helpful. Format your response in clear sections.
Keep responses concise but thorough — aim for 3-5 sentences per section.`;

    const userPrompt = `Vehicle Record:
- VIN: ${vin}
- Status: ${status.replace("_", " ").toUpperCase()}
- History: ${description}

Buyer's Question: ${question}

Please provide:
1. **Risk Assessment**: Overall risk level and what it means
2. **Safety Concerns**: Specific safety issues to be aware of
3. **Maintenance Expectations**: What the buyer should expect to spend/fix
4. **Recommendation**: Should they buy this vehicle or not, and why`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error("AI risk analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate risk analysis. Please try again." },
      { status: 500 }
    );
  }
}