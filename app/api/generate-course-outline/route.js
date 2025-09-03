import { generateStructuredCourse } from "@/configs/AiModel";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Incoming request body:", body);

    const { courseId, topic, courseType, difficultyLevel, createdBy } = body;

    if (!topic || !courseType || !difficultyLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate course outline with AI
    const aiResp = await generateStructuredCourse(
      topic,
      courseType,
      difficultyLevel
    );
    console.log("AI Response:", aiResp);

    // Build final object
    const result = {
      courseId,
      createdBy,
      topic,
      courseType,
      difficultyLevel,
      courseLayout: aiResp,
      status: "Completed",
    };

    // Save to DB
    const inserted = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values(result)
      .returning();

    console.log("Inserted study material:", inserted);

    return NextResponse.json(inserted[0], { status: 200 });
  } catch (err) {
    console.error("AI generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate and save course outline" },
      { status: 500 }
    );
  }
}
