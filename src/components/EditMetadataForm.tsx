"use client";

import { useState, useEffect } from "react";

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

interface EditMetadataFormProps {
  initialMetadata: SongMetadata;
  onSave: (updatedMetadata: SongMetadata) => void;
}

const EditMetadataForm: React.FC<EditMetadataFormProps> = ({
  initialMetadata,
  onSave,
}) => {
  const [metadata, setMetadata] = useState<SongMetadata>(initialMetadata);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMetadata({ ...metadata, [name]: value });
  };

  const handleVersionChange = (index: number, field: string, value: string) => {
    const updatedVersions = metadata.versions.map((version, i) =>
      i === index ? { ...version, [field]: value } : version
    );
    setMetadata({ ...metadata, versions: updatedVersions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(metadata);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="flex mb-2">
        <span className="block p-1 w-[100px]">Title</span>
        <input
          className="border p-1 w-[400px]"
          name="title"
          value={metadata.title}
          onChange={handleChange}
        />
      </label>
      <label className="flex mb-2">
        <span className="block p-1 w-[100px]">Composer</span>

        <input
          className="border p-1 w-[400px]"
          name="composer"
          value={metadata.composer}
          onChange={handleChange}
        />
      </label>
      <label className="flex mb-2">
        <span className="block p-1 w-[100px]">Genre</span>
        <input
          className="border p-1 w-[400px]"
          name="genre"
          value={metadata.genre}
          onChange={handleChange}
        />
      </label>
      <label className="flex mb-2">
        <span className="block p-1 w-[100px]">Description</span>
        <textarea
          className="border p-1 w-[400px]"
          name="description"
          value={metadata.description}
          onChange={handleChange}
        />
      </label>

      <h3>Versions</h3>
      {metadata.versions.map((version, index) => (
        <div key={index}>
          <label>
            Version Name:
            <input
              value={version.name}
              onChange={(e) =>
                handleVersionChange(index, "name", e.target.value)
              }
            />
          </label>
          <label>
            Version Number:
            <input
              value={version.version}
              onChange={(e) =>
                handleVersionChange(index, "version", e.target.value)
              }
            />
          </label>
        </div>
      ))}

      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditMetadataForm;
