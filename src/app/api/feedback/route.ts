import { NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/resend";

const feedbackSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  message: z.string().trim().min(10).max(3000),
  rating: z.number().int().min(1).max(5),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = feedbackSchema.parse(body);

    await resend.emails.send({
      from: "Lesspriz Feedback <alerts@lesspriz.com>",
      to: "mhdrishou@gmail.com",
      replyTo: parsed.email,
      subject: `New Lesspriz review (${parsed.rating}/5)`,
      html: `
        <h2>New customer review</h2>
        <p><strong>Name:</strong> ${parsed.name}</p>
        <p><strong>Email:</strong> ${parsed.email}</p>
        <p><strong>Rating:</strong> ${parsed.rating}/5</p>
        <p><strong>Message:</strong></p>
        <p>${parsed.message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feedback email failed", error);
    return NextResponse.json({ error: "Failed to send feedback" }, { status: 400 });
  }
}
