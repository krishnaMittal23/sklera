import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, studyType } = await req.json();

    if (!courseId || !studyType) {
      return NextResponse.json(
        { error: "Missing courseId or studyType" },
        { status: 400 }
      );
    }

    if (studyType === "ALL") {
      const notes = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));

      const result = {
        notes,
        flashCard: null,
        quiz: null,
        qa: null,
      };

      return NextResponse.json(result);
    }

    // fallback for other studyType values
    return NextResponse.json(
      { message: `Unsupported studyType: ${studyType}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in /api/study-type:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
