import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { vin, status, description, question } = await request.json();

    if (!vin || !status || !description || !question) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error("AI risk analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate risk analysis. Please try again." },
      { status: 500 }
    );
  }
}