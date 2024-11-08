"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Song {
  handle: string;
  title: string;
}

const DirectoryOfSongs: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/api/songs");
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const data: Song[] = await response.json();
        setSongs(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <ul>
        {songs.map((song) => (
          <li key={song.handle}>
            <Link href={`/songs/${song.handle}`}>{song.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DirectoryOfSongs;
