import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user } = await req.json();

    if (!user) {
      return NextResponse.json({ error: "User object missing" }, { status: 400 });
    }

    // Normalize Clerk user into plain JSON
    const normalizedUser = {
      id: user.id,
      name: user.fullName || [user.firstName, user.lastName].filter(Boolean).join(" "),
      email:
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        null,
    };

    if (!normalizedUser.email) {
      return NextResponse.json({ error: "User email missing" }, { status: 400 });
    }

    // Send Inngest event
    const result = await inngest.send({
      name: "user.create",
      data: { user: normalizedUser },
    });

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error("Error in /api/create-user:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
