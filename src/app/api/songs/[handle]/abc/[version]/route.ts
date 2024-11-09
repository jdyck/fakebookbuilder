import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const songsDir = path.join(process.env.SONGS_SRC_PATH || "", "songs");

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ handle: string; version: string }> }
) {
  const { handle, version } = await context.params; // Await the promise

  const abcFilePath = path.join(songsDir, handle, `${handle}-${version}.abc`);

  try {
    if (!fs.existsSync(abcFilePath)) {
      return NextResponse.json(
        { error: "ABC file not found" },
        { status: 404 }
      );
    }

    const abcContent = fs.readFileSync(abcFilePath, "utf-8");
    return NextResponse.json({ abcContent }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/songs/[handle]/abc/[version]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve ABC content" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ handle: string; version: string }> }
) {
  const { handle, version } = await context.params; // Await the promise

  const abcFilePath = path.join(songsDir, handle, `${handle}-${version}.abc`);

  try {
    const newContent = await request.text();
    fs.writeFileSync(abcFilePath, newContent, "utf-8");

    return NextResponse.json(
      { message: "ABC content saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT /api/songs/[handle]/abc/[version]:", error);
    return NextResponse.json(
      { error: "Failed to save ABC content" },
      { status: 500 }
    );
  }
}
