import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const songsDir = path.join(process.env.SONGS_SRC_PATH || "", "songs");

export async function POST(
  request: Request,
  { params }: { params: { handle: string } }
): Promise<NextResponse> {
  const { handle } = params;
  const songDir = path.join(songsDir, handle);
  const songPath = path.join(songDir, `${handle}.json`);

  try {
    if (!fs.existsSync(songPath)) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, version, abcContent } = body;

    const metadata = JSON.parse(fs.readFileSync(songPath, "utf-8"));
    metadata.versions.push({ name, version });

    fs.writeFileSync(songPath, JSON.stringify(metadata, null, 2));
    fs.writeFileSync(
      path.join(songDir, `${handle}-${version}.abc`),
      abcContent
    );

    return NextResponse.json(
      { message: "Version added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/songs/[handle]/versions:", error);
    return NextResponse.json(
      { error: "Failed to add version" },
      { status: 500 }
    );
  }
}
