// app/api/chat/route.ts

// @ts-nocheck
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: groq("llama-3-70B-versatile"),
    system: "You are a helpful assistant.",
    prompt,
  });

  return Response.json({ text });
}
