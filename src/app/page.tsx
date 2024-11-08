import DirectoryOfSongs from "@/components/DirectoryOfSongs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="m-auto max-w-[600px]">
      <h1 className="font-black uppercase text-5xl max-w-[300px] mt-16 mb-8 m-auto text-center">
        {process.env.NAME_OF_BOOK}
      </h1>
      <p className="mb-12 text-lg italic leading-tight">
        {process.env.DESCRIPTION_OF_BOOK}
      </p>

      <h2 className="text-sm uppercase font-bold border-b border-gray-400 mb-8 flex justify-between">
        <span className="block pt-2 my-2">Table of Contents</span>
        <Link
          href="/songs/new"
          className="text-xs font-bold text-white bg-gray-800 p-2 rounded my-2 block"
        >
          + Add Song
        </Link>
      </h2>

      <DirectoryOfSongs />
    </main>
  );
}
