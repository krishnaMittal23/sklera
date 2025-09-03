import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    summary: z.string(),
    chapters: z.array(
      z.object({
        name: z.string(),
        summary: z.string(),
        topics: z.array(z.string()),
      })
    ),
  })
);

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  model: "gemini-2.0-flash",
});

export async function generateStructuredCourse(topic, courseType, difficultyLevel) {
  const formatInstructions = parser.getFormatInstructions();

  const prompt = `
Generate a study material for ${topic} for ${courseType} 
and level of difficulty will be ${difficultyLevel}.
Include: summary of course, list of chapters with summary for each, 
and topic list inside each chapter. 
Return ALL results strictly in JSON format.

${formatInstructions}
`;

  const res = await model.invoke(prompt);

  try {
    const parsed = await parser.parse(res.content);
    return parsed;
  } catch (err) {
    console.error("Parser failed, returning raw:", res.content);
    return { summary: "Parsing failed", chapters: [], raw: res.content };
  }
}
