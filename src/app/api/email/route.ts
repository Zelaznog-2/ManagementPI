import { EmailTemplate } from "@/components/emails/FirstEmail";
import { resend } from "@/lib/email/index";
import { emailSchema } from "@/lib/email/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, id } = emailSchema.parse(body);
  try {
    const data = await resend.emails.send({
      from: "Management <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Management",
      react: EmailTemplate({ firstName: name, id }),
      text: "Email powered by Resend.",
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
