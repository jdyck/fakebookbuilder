"use client";

import { useEffect } from "react";
import Link from "next/link";
import abcjs from "abcjs";

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

interface SongDisplayProps {
  songMetadata: SongMetadata;
  abcData: string[];
  abcOptions: object;
}

const SongDisplay: React.FC<SongDisplayProps> = ({
  songMetadata,
  abcData,
  abcOptions,
}) => {
  useEffect(() => {
    abcData.forEach((data, index) => {
      abcjs.renderAbc(`notation-${index}`, data, abcOptions);
    });
  }, [abcData, abcOptions]);

  return (
    <div className="m-auto">
      {songMetadata.versions.map((version, index) => (
        <div key={version.version} className=" max-w-full w-[700px]">
          <Link
            href={`/songs/${songMetadata.handle}/editChart/${version.version}`}
          >
            Edit
          </Link>
          <div id={`notation-${index}`} className=""></div>
        </div>
      ))}
    </div>
  );
};

export default SongDisplay;
