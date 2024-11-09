"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <main className="m-auto max-w-lg">
      <h1 className="font-bold text-xl mb-8">Add New Song</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 justify-start"
      >
        <label>
          <span className="block"> Title</span>

          <input
            className="border w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          <span className="block">Composer</span>
          <input
            className="border w-full"
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
          />
        </label>
        <label>
          <span className="block">Genre</span>

          <input
            className="border w-full"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </label>
        <label>
          <span className="block">Description</span>
          <textarea
            className="border w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="flex">
          <button
            type="submit"
            className="bg-black text-white p-1.5 px-3 rounded max-w-40 uppercase font-bold text-xs"
          >
            Add Song
          </button>
          <Link href="/" className="pt-1 px-3 inline-block">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
