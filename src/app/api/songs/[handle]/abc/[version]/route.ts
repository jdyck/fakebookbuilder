import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const songsDir = path.join(process.env.SONGS_SRC_PATH || "", "songs");

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const { handle, version } = params;
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
