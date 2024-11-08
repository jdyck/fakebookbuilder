"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSongPage() {
  const [title, setTitle] = useState("");
  const [composer, setComposer] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSong = { title, composer, genre, description, versions: [] };

    const response = await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSong),
    });

    if (response.ok) {
      const data = await response.json();
      router.push(`/songs/${data.handle}`);
    } else {
      console.error("Failed to add new song");
    }
  };

  return (
    <main>
      <h1>Add New Song</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <label>
          Title:
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Composer:
          <input
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
          />
        </label>
        <label>
          Genre:
          <input value={genre} onChange={(e) => setGenre(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button type="submit">Add Song</button>
      </form>
    </main>
  );
}
