"use client";

import EditMetadataForm from "@/components/EditMetadataForm";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

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

export default function EditMetadataPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = use(params);
  const [metadata, setMetadata] = useState<SongMetadata | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`/api/songs/${handle}`);
        if (!response.ok) throw new Error("Failed to fetch song metadata");

        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMetadata();
  }, [handle]);

  const handleSave = async (updatedMetadata: SongMetadata) => {
    try {
      const response = await fetch(`/api/songs/${handle}/metadata`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMetadata),
      });
      if (!response.ok) throw new Error("Failed to update metadata");

      setMetadata(updatedMetadata);
      router.push(`/songs/${handle}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (!metadata) return <p>Loading metadata...</p>;

  return (
    <main>
      <a href={`/songs/${handle}`}>Back</a>
      <h1 className="font-bold text-xl mb-2">Editing {metadata.title}</h1>
      <EditMetadataForm initialMetadata={metadata} onSave={handleSave} />

      <button
        onClick={() => router.push(`/songs/${handle}/newChart`)}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        + Chart
      </button>
    </main>
  );
}
