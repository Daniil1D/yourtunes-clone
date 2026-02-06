import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";

interface Params {
  id: string;
}

export async function PATCH(req: Request, context: { params: Params }) {
  const params = await context.params;
  const trackId = params.id;

  if (!trackId) {
    return NextResponse.json({ error: "Track ID is required" }, { status: 400 });
  }

  const body = await req.json();
  if (!body || Object.keys(body).length === 0) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  try {
    const track = await prisma.track.update({
      where: { id: trackId },
      data: body,
    });

    return NextResponse.json(track);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Params }) {
  const params = await context.params;
  const trackId = params.id;

  if (!trackId) {
    return NextResponse.json({ error: "Track ID is required" }, { status: 400 });
  }

  try {
    await prisma.track.delete({
      where: { id: trackId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cannot delete track" }, { status: 500 });
  }
}
