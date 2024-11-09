"use client";

import { useState, useEffect } from "react";
import SongDisplay from "@/components/SongDisplay";
import Link from "next/link";

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

interface SongPageClientProps {
  songMetadata: SongMetadata;
  initialABCData: string | null;
  handle: string;
}

export default function SongPageClient({
  songMetadata,
  initialABCData,
  handle,
}: SongPageClientProps) {
  const hasVersions = songMetadata.versions && songMetadata.versions.length > 0;
  const [currentABCData, setCurrentABCData] = useState<string>(
    initialABCData || ""
  );
  const [selectedVersion, setSelectedVersion] = useState(
    hasVersions ? songMetadata.versions[0].version : null
  );

  const abcOptions = {
    responsive: "resize",
  };

  useEffect(() => {
    if (!hasVersions) {
      setCurrentABCData("");
    }
  }, [hasVersions]);

  const handleVersionChange = async (version: string) => {
    const response = await fetch(`/api/songs/${handle}/abc/${version}`);
    const data = await response.json();
    setCurrentABCData(data.abcContent);
    setSelectedVersion(version);
  };

  return (
    <div>
      {hasVersions ? (
        <>
          <SongDisplay
            songMetadata={songMetadata}
            abcData={[currentABCData]}
            abcOptions={abcOptions}
          />
          {songMetadata.versions.map((version) => (
            <button
              key={version.version}
              onClick={() => handleVersionChange(version.version)}
              style={{
                fontWeight:
                  selectedVersion === version.version ? "bold" : "normal",
                margin: "0 4px",
              }}
            >
              {version.name}
            </button>
          ))}
          <Link
            href={`/songs/${handle}/newChart`}
            style={{ marginBottom: "1rem", display: "block" }}
          >
            + Chart
          </Link>
        </>
      ) : (
        <>
          <h1 className="font-bold font-serif text-xl">{songMetadata.title}</h1>
          <p>{songMetadata.composer}</p>
          <Link
            href={`/songs/${handle}/newChart/1`}
            style={{ marginBottom: "1rem", display: "block" }}
          >
            + First Chart
          </Link>
        </>
      )}

      <h2 className="text-sm uppercase font-bold border-b border-gray-400 mb-8 flex justify-between">
        <span className="block pt-2 my-2">Song Notes</span>

        <Link
          className="text-xs font-bold text-white bg-gray-800 p-2 rounded my-2 block"
          href={`/songs/${handle}/edit`}
        >
          Edit
        </Link>
      </h2>

      <p>{songMetadata.description}</p>
    </div>
  );
}
