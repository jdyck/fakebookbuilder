"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EditAbcPageProps {
  params: Promise<{ handle: string; version: string }>;
}

const EditAbcPage: React.FC<EditAbcPageProps> = ({ params }) => {
  const [handle, setHandle] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [abcContent, setAbcContent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setHandle(resolvedParams.handle);
      setVersion(resolvedParams.version);
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchAbcContent = async () => {
      if (handle && version) {
        try {
          const response = await fetch(`/api/songs/${handle}/abc/${version}`);
          if (!response.ok) throw new Error("Failed to fetch ABC content");

          const data = await response.text();
          setAbcContent(data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAbcContent();
  }, [handle, version]);

  const handleSave = async (updatedAbc: string) => {
    if (handle && version) {
      try {
        const response = await fetch(`/api/songs/${handle}/abc/${version}`, {
          method: "PUT",
          headers: { "Content-Type": "text/plain" },
          body: updatedAbc,
        });
        if (!response.ok) throw new Error("Failed to save ABC content");

        router.push(`/songs/${handle}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!handle || !version || abcContent === null) {
    return <p>Loading ABC content...</p>;
  }

  return (
    <main>
      <Link href={`/songs/${handle}`}>Back</Link>
      <h1>Edit ABC Notation for Version {version}</h1>
      <div>
        <h2>Edit ABC Notation</h2>
        <textarea
          value={abcContent}
          onChange={(e) => setAbcContent(e.target.value)}
          rows={15}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
        <button
          onClick={() => handleSave(abcContent)}
          style={{ marginTop: "1rem" }}
        >
          Save Changes
        </button>
      </div>
    </main>
  );
};

export default EditAbcPage;
