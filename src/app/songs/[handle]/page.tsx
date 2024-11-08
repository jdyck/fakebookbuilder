import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import SongPageClient from "@/components/SongPageClient";

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

const songsDir = path.join(process.env.SONGS_SRC_PATH || "", "songs");

export async function generateStaticParams() {
  const songFolders = fs.readdirSync(songsDir);
  return songFolders.map((handle) => ({ handle }));
}

async function loadABCFile(handle: string, version: string): Promise<string> {
  const filePath = path.join(songsDir, handle, `${handle}-${version}.abc`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  } else {
    throw new Error(`ABC file for version ${version} not found`);
  }
}

export default async function SongPage({
  params: asyncParams,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await asyncParams;
  const songPath = path.join(songsDir, handle, `${handle}.json`);

  if (!fs.existsSync(songPath)) {
    notFound();
  }

  const songMetadata: SongMetadata = JSON.parse(
    fs.readFileSync(songPath, "utf-8")
  );

  const initialABCData =
    songMetadata.versions && songMetadata.versions.length > 0
      ? await loadABCFile(handle, songMetadata.versions[0].version)
      : null;

  return (
    <main>
      <Link href="/">Back</Link>
      <SongPageClient
        songMetadata={songMetadata}
        initialABCData={initialABCData}
        handle={handle}
      />
    </main>
  );
}
