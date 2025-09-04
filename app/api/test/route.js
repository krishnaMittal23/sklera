import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await db.select().from(USER_TABLE);
    return NextResponse.json({ users });
  } catch (err) {
    console.error("DB test error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
