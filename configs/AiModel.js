import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

// This parser is used for the structured course outline, ensuring the output is a valid JSON object.
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

// This model instance is for generating the structured course outline.
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  model: "gemini-2.0-flash",
});

/**
 * Generates a structured course outline based on a topic, type, and difficulty.
 * The output is a parsed JSON object following the defined Zod schema.
 */
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

// This model instance is for generating the detailed HTML notes for each chapter.
// It uses a separate instance to avoid conflicts with the structured parser.
const notesModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  model: "gemini-2.0-flash",
});

/**
 * Generates detailed HTML-formatted content for a single chapter.
 *
 * @param {Object} chapter An object representing a single chapter.
 * @returns {Promise<string>} A promise that resolves to a string containing the HTML content.
 */
export const generateNotesAiModel = async (chapter) => {
  const topicsList = chapter.topics.map(topic => `- ${topic}`).join('\n');
  const chapterText = `
    Chapter: ${chapter.name}
    Summary: ${chapter.summary}
    Topics to cover:
    ${topicsList}
  `;

  const prompt = `
Generate detailed and comprehensive exam material content for the following chapter.
The content for the chapter must be in HTML format. Do not add <html>, <head>, <body>, or <title> tags.
The chapter should be a <section> with an <h2> heading for the chapter name.
Each topic within the chapter should be a <h3> heading, followed by detailed paragraphs explaining the topic.
Use <strong> and <em> tags to emphasize key terms and concepts.
Ensure all topic points for this chapter are covered thoroughly in the content.

The chapter and its topics are:
${chapterText}
`;

  const res = await notesModel.invoke(prompt);
  
  return res.content;
};
