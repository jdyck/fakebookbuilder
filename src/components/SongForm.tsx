"use client";

import { useState, useEffect, useRef } from "react";
import abcjs from "abcjs";

interface SongFormProps {
  title: string;
  handle: string;
  initialData?: {
    name?: string;
    version?: string;
    abcContent?: string;
  };
  onSubmit: (data: {
    name: string;
    version: string;
    abcContent: string;
  }) => Promise<void>;
}

export default function SongForm({
  title,
  handle,
  initialData,
  onSubmit,
}: SongFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [version, setVersion] = useState(initialData?.version || "1");
  const [abcContent, setAbcContent] = useState(
    initialData?.abcContent || `X:1\nT:${title}\nM:\nL:1/8\nK:`
  );
  const abcContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abcContainerRef.current) {
      abcContainerRef.current.innerHTML = "";
      abcjs.renderAbc(abcContainerRef.current, abcContent);
    }
  }, [abcContent]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, version, abcContent });
  };

  return (
    <form onSubmit={handleFormSubmit} className="my-8">
      <label className="mb-4 block">
        <span>Version Name</span>
        <input
          className="border p-1.5 w-full"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="mb-4 block">
        Version Number
        <input
          className="border p-1.5 w-full"
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          required
        />
      </label>
      <label className="mb-4 block">
        ABC Notation
        <textarea
          className="p-1.5 border"
          value={abcContent}
          onChange={(e) => setAbcContent(e.target.value)}
          rows={10}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
      </label>
      <button
        type="submit"
        className="text-xs font-bold uppercase bg-black rounded text-white p-3 py-1.5"
      >
        {initialData ? "Update Version" : "Add Version"}
      </button>
      <div ref={abcContainerRef} />
    </form>
  );
}
