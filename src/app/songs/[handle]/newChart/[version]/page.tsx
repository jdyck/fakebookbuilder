"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SongForm from "@/components/SongForm";
import Link from "next/link";

// Interface defining the structure of data needed for a new song version
interface NewVersionData {
  name: string;
  version: string;
  abcContent: string;
}

// Main component for the New Version Page
export default function NewVersionPage({
  params,
}: {
  params: { handle: string };
}) {
  // Destructuring handle from params, representing the song identifier
  const { handle } = params;

  // State variables
  const [title, setTitle] = useState(""); // Stores the song's title
  const [versionNumber, setVersionNumber] = useState("1"); // Stores the next version number
  const router = useRouter(); // Router instance for navigation after form submission

  // useEffect hook to fetch song metadata when the component mounts or when 'handle' changes
  useEffect(() => {
    // Function to fetch metadata of the current song
    const fetchMetadata = async () => {
      try {
        // Request to get song metadata by handle
        const response = await fetch(`/api/songs/${handle}`);
        if (!response.ok) throw new Error("Failed to fetch song metadata"); // Error handling for failed requests

        // Parsing the JSON response containing the song metadata
        const data = await response.json();
        setTitle(data.title); // Setting the song title from the metadata

        // Calculating the latest version number by parsing, sorting, and incrementing
        const latestVersion: number | undefined = data.versions
          .map(
            (versionObj: { version: string }): number =>
              parseInt(versionObj.version, 10) // Parsing version strings to numbers
          )
          .filter((parsedVersion: number): boolean => !isNaN(parsedVersion)) // Filtering out invalid versions
          .sort(
            (firstVersion: number, secondVersion: number): number =>
              secondVersion - firstVersion // Sorting in descending order
          )[0]; // Selecting the highest version

        // Setting the next version number as one increment higher than the latest
        setVersionNumber(latestVersion ? String(latestVersion + 1) : "1");
      } catch (error) {
        console.error(error); // Logging errors for debugging
      }
    };

    // Call to fetch metadata when component mounts
    fetchMetadata();
  }, [handle]); // Re-run this effect if 'handle' changes

  // Function to handle the submission of a new version, called when the form is submitted
  const handleNewVersionSubmit = async (newVersion: NewVersionData) => {
    try {
      // Sending a POST request to add the new version to the backend
      const response = await fetch(`/api/songs/${handle}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVersion), // Sending new version data in the request body
      });

      if (response.ok) {
        // Redirect to the metadata edit page if the submission is successful
        router.push(`/songs/${handle}/edit`);
      } else {
        // If an error occurs, display the error message
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      alert(`Unexpected error: ${error}`); // General error handling
    }
  };

  // Rendering the New Version Page UI
  return (
    <main>
      <Link href={`/songs/${handle}`}>Back</Link>
      <h1 className="font-bold text-xl">
        Add a new chart for
        <span className="block text-2xl font-bold">{title}</span>
      </h1>
      <SongForm
        title={title}
        handle={handle}
        onSubmit={handleNewVersionSubmit}
      />
    </main>
  );
}
