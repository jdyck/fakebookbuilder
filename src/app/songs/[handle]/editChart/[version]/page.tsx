"use client";

import { useState, useEffect, useRef } from "react";
import abcjs from "abcjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EditAbcPageProps {
  params: Promise<{ handle: string; version: string }>;
}

interface AbcContentResponse {
  abcContent: string;
  title: string;
}

const EditAbcPage: React.FC<EditAbcPageProps> = ({ params }) => {
  const [handle, setHandle] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [abcContent, setAbcContent] = useState<string | null>(null);
  const abcContainerRef = useRef<HTMLDivElement>(null);
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

          const data: AbcContentResponse = await response.json();
          setAbcContent(data.abcContent);
          setTitle(data.title);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAbcContent();
  }, [handle, version]);

  useEffect(() => {
    if (abcContainerRef.current && abcContent) {
      // Clear any previous rendering and render the updated ABC content
      abcContainerRef.current.innerHTML = "";
      abcjs.renderAbc(abcContainerRef.current, abcContent);
    }
  }, [abcContent]);

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
      <h1>Edit chart for {title}</h1>
      <div>
        <textarea
          className="p-1.5 border"
          value={abcContent}
          onChange={(e) => setAbcContent(e.target.value)}
          rows={15}
          style={{ width: "100%", fontFamily: "monospace" }}
        />
        <button
          onClick={() => handleSave(abcContent)}
          className="bg-black p-3 py-1.5 uppercase text-white rounded font-bold text-xs"
        >
          Save Changes
        </button>
      </div>
      <div ref={abcContainerRef} className="mt-4 border p-2" />
    </main>
  );
};

export default EditAbcPage;
