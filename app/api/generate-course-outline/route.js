import { generateStructuredCourse } from "@/configs/AiModel";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";

/**
 * Handles the POST request to generate and save a new study material course.
 * This route first generates the course outline with an AI and then triggers an Inngest function
 * to asynchronously generate the detailed chapter notes.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Incoming request body:", body);

    const { courseId, topic, courseType, difficultyLevel, createdBy } = body;

    // Validate that all required fields are present in the request body.
    if (!topic || !courseType || !difficultyLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate the structured course outline using the AI model.
    const aiResp = await generateStructuredCourse(
      topic,
      courseType,
      difficultyLevel
    );
    console.log("AI Response:", aiResp);

    // Build the final object to be saved to the database.
    const result = {
      courseId,
      createdBy,
      topic,
      courseType,
      difficultyLevel,
      courseLayout: aiResp,
      status: "Generating",
    };

    // Save the new study material entry to the database.
    const inserted = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values(result)
      .returning();

    // Trigger the Inngest function to handle the long-running task of generating chapter notes.
    // This allows the API to respond quickly to the client.
    const res = await inngest.send({
      name: 'notes.generate',
      data: {
        course: inserted[0]
      }
    });

    console.log(res);

    console.log("Inserted study material:", inserted);

    // Return the inserted record as a successful response.
    return NextResponse.json(inserted[0], { status: 200 });

  } catch (err) {
    console.error("AI generation or database error:", err);
    return NextResponse.json(
      { error: "Failed to generate and save course outline" },
      { status: 500 }
    );
  }
}
