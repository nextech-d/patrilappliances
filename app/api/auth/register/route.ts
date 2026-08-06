import { NextResponse } from "next/server";
import { registerUser } from "../../../lib/users.server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
      phone?: string;
    };

    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const user = await registerUser({
      email: body.email,
      password: body.password,
      name: body.name,
      phone: body.phone,
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    const status = message.includes("already exists") ? 409 : 400;
    return NextResponse.json({ success: false, message }, { status });
  }
}
