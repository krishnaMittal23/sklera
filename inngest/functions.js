import { db } from "@/configs/db";
import { inngest } from "./client";
import { STUDY_MATERIAL_TABLE, USER_TABLE, CHAPTER_NOTES_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { generateNotesAiModel } from "@/configs/AiModel";

export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const { user } = event.data;
    const { name, email } = user;

    if (!email) {
      throw new Error("User email is missing in event payload");
    }

    return await step.run("Check User and create New if not in DB", async () => {
      const existing = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, email));

      if (existing.length === 0) {
        const inserted = await db
          .insert(USER_TABLE)
          .values({
            name: name || "Anonymous",
            email,
          })
          .returning({ id: USER_TABLE.id });

        console.log("New user inserted:", inserted[0]);
        return inserted[0];
      }

      console.log("User already exists:", existing[0]);
      return existing[0];
    });
  }
);

export const GenerateNotes = inngest.createFunction(
  { id: 'generate-course' },
  { event: 'notes.generate' },
  async ({ event, step }) => {
    const { course } = event.data;
    const chapters = course?.courseLayout?.chapters;

    if (!chapters || chapters.length === 0) {
      console.error("No chapters found in courseLayout");
      return;
    }

    // Generate notes for each chapter with AI
    const notesResult = await step.run('Generate Chapter Notes', async () => {
      let index = 0;
      for (const chapter of chapters) {
        // The generateNotesAiModel function now expects a single chapter object
        const aiResp = await generateNotesAiModel(chapter);

        await db.insert(CHAPTER_NOTES_TABLE).values({
          chapterId: index,
          courseId: course.courseId,
          notes: aiResp
        });
        
        index++;
      }
      return 'Completed';
    });

    // Update status to ready
    const updateCourseStatusResult = await step.run('Update Course status to Ready', async () => {
      await db.update(STUDY_MATERIAL_TABLE).set({
        status: 'Ready'
      }).where(eq(STUDY_MATERIAL_TABLE.courseId, course.courseId)).returning();
        
      console.log("updated",updated)
    });
  }
);
