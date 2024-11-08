import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const songsDir = path.join(process.env.SONGS_SRC_PATH || "", "songs");

export async function PUT(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const { handle } = await params;
  const songPath = path.join(songsDir, handle, `${handle}.json`);

  try {
    const metadata = await request.json();
    fs.writeFileSync(songPath, JSON.stringify(metadata, null, 2));
    return NextResponse.json(
      { message: "Metadata updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update metadata" },
      { status: 500 }
    );
  }
}
