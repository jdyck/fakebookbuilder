import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const songsDir = path.join(process.env.SONGS_SRC_PATH || "", "songs");

interface SongVersion {
  name: string;
  version: string;
}

interface SongMetadata {
  title: string;
  handle: string;
  composer: string;
  genre: string;
  description: string;
  versions: SongVersion[];
}

interface SongSummary {
  handle: string;
  title: string;
}

// GET /api/songs - List all songs
export async function GET(): Promise<NextResponse> {
  try {
    const songHandles: SongSummary[] = fs
      .readdirSync(songsDir)
      .map((folder) => {
        const metadataPath = path.join(songsDir, folder, `${folder}.json`);
        const metadata: SongMetadata = JSON.parse(
          fs.readFileSync(metadataPath, "utf-8")
        );
        return { handle: folder, title: metadata.title };
      });

    return NextResponse.json(songHandles, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to retrieve songs" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const {
      title,
      composer,
      genre,
      description,
      versions = [],
    }: Partial<SongMetadata> = body;

    if (!title || !composer || !genre || !description) {
      return NextResponse.json(
        { error: "Invalid data structure for song metadata" },
        { status: 400 }
      );
    }

    const cleanedTitle = title.toLowerCase().replace(/^(the |a |an )/, "");
    const handle = cleanedTitle
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const songDir = path.join(songsDir, handle);

    if (fs.existsSync(songDir)) {
      return NextResponse.json(
        { error: "Song already exists" },
        { status: 409 }
      );
    }

    fs.mkdirSync(songDir);
    const metadata: SongMetadata = {
      title,
      handle,
      composer,
      genre,
      description,
      versions,
    };
    fs.writeFileSync(
      path.join(songDir, `${handle}.json`),
      JSON.stringify(metadata, null, 2)
    );

    // Return the handle in the response
    return NextResponse.json(
      { message: "Song created successfully", handle },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST /api/songs:", err);
    return NextResponse.json(
      { error: "Failed to create song" },
      { status: 500 }
    );
  }
}
