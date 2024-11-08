"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Version {
  name: string;
  version: string;
}

interface SongMetadata {
  title: string;
  handle: string;
  composer?: string;
  genre?: string;
  description?: string;
  versions: Version[];
}

const NewChartForm = ({
  metadata,
  handle,
}: {
  metadata: SongMetadata;
  handle: string;
}) => {
  const router = useRouter();
  const [newVersion, setNewVersion] = useState("1");
  const [chartContent, setChartContent] = useState("");

  useEffect(() => {
    if (metadata.versions && metadata.versions.length > 0) {
      const highestVersion = metadata.versions.reduce(
        (max, version) => Math.max(max, parseInt(version.version, 10)),
        0
      );
      setNewVersion((highestVersion + 1).toString());
    }
  }, [metadata]);

  const handleSave = async () => {
    const response = await fetch(`/api/songs/${handle}/abc/${newVersion}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: chartContent }),
    });

    if (response.ok) {
      alert("New chart version saved successfully!");
      router.push(`/songs/${handle}`);
    } else {
      alert("Failed to save the new chart version.");
    }
  };

  return (
    <div>
      <h1>Create New Chart for {metadata.title}</h1>
      <p>Composer: {metadata.composer}</p>
      <p>Description: {metadata.description}</p>
      <p>Genre: {metadata.genre}</p>
      <div>
        <label>
          Version Number:
          <input
            type="text"
            value={newVersion}
            readOnly
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>
      <div style={{ marginTop: "20px" }}>
        <label>
          Chart Content:
          <textarea
            rows={10}
            cols={50}
            value={chartContent}
            onChange={(e) => setChartContent(e.target.value)}
            placeholder="Enter chart content here..."
            style={{ display: "block", marginTop: "10px" }}
          />
        </label>
      </div>
      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Save New Chart
      </button>
    </div>
  );
};

export default NewChartForm;
