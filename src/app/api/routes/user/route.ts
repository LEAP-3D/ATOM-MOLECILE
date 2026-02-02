import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    return new NextResponse("Missing signing secret", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("No svix headers", { status: 400 });
  }

  const payload = await req.text();
  const svixHeaders = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  let evt: WebhookEvent;

  try {
    const wh = new Webhook(SIGNING_SECRET);
    evt = wh.verify(payload, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!id || !email) return new NextResponse("Missing data", { status: 400 });

    // ✅ P2002 алдаанаас сэргийлж email-ээр хайж upsert хийх
    await prisma.user.upsert({
      where: { email: email },
      update: {
        id: id,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
      create: {
        id: id,
        email: email,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
    });
  }

  if (eventType === "user.deleted" && id) {
    await prisma.user
      .delete({
        where: { id: id },
      })
      .catch((_e) => console.log("User already deleted")); // ✅ Засагдсан: 'e' -> '_e'
  }

  return NextResponse.json({ success: true });
}
