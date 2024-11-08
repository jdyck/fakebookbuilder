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
    <form
      onSubmit={handleFormSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <label>
        Version Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Version Number:
        <input
          type="text"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          required
        />
      </label>
      <label>
        ABC Notation:
        <textarea
          className="p-1 border"
          value={abcContent}
          onChange={(e) => setAbcContent(e.target.value)}
          rows={10}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
      </label>
      <button type="submit">
        {initialData ? "Update Version" : "Add Version"}
      </button>
      <div ref={abcContainerRef} />
    </form>
  );
}
