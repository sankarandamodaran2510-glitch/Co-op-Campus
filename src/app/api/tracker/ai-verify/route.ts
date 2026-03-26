import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { commitMessage } = await request.json();

    if (!commitMessage) {
      return NextResponse.json({ error: "Missing commitMessage" }, { status: 400 });
    }

    // Mock AI Verification logic for MVP
    // In a real scenario, this would call OpenAI or Gemini APIs using langchain or direct SDK.
    const lowerMsg = commitMessage.toLowerCase();
    
    // Heuristic for "meaningful work"
    const isSpam = 
      lowerMsg.length < 5 || 
      lowerMsg === "update readme.md" ||
      lowerMsg === "initial commit" ||
      lowerMsg === "test" ||
      lowerMsg.includes("spelling mistake");

    // Simulate LLM API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      ai_verified: !isSpam,
      reason: isSpam ? "Commit message lacks descriptive substance. Not verified by AI." : "AI verified: Meaningful structural or logical changes.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
