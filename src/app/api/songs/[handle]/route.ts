import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const songsDir = path.join(process.env.SONGS_SRC_PATH || "", "songs");

// GET /api/songs/[handle] - Get song metadata
export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
): Promise<NextResponse> {
  const { handle } = await params;
  const songPath = path.join(songsDir, handle, `${handle}.json`);

  try {
    if (!fs.existsSync(songPath)) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const metadata = JSON.parse(fs.readFileSync(songPath, "utf-8"));
    return NextResponse.json(metadata, { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/songs/[handle]:", err);
    return NextResponse.json(
      { error: "Failed to retrieve song metadata" },
      { status: 500 }
    );
  }
}

// POST /api/songs/[handle]/versions - Add a new version for a song
export async function POST(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
): Promise<NextResponse> {
  const { handle } = await params;
  const songDir = path.join(songsDir, handle);
  const songPath = path.join(songDir, `${handle}.json`);

  try {
    if (!fs.existsSync(songPath)) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, version } = body;

    // Load existing metadata and add the new version
    const metadata = JSON.parse(fs.readFileSync(songPath, "utf-8"));
    metadata.versions.push({ name, version });

    // Save updated metadata back to file
    fs.writeFileSync(songPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json(
      { message: "Version added successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST /api/songs/[handle]/versions:", err);
    return NextResponse.json(
      { error: "Failed to add version" },
      { status: 500 }
    );
  }
}
