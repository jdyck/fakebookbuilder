import NewChartForm from "@/components/NewChartForm";

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

const NewChartPage = async ({ params }: { params: { handle: string } }) => {
  const { handle } = params;

  // Fetch metadata server-side
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/songs/${handle}/metadata`
  );
  const metadata: SongMetadata = await res.json();

  return <NewChartForm metadata={metadata} handle={handle} />;
};

export default NewChartPage;
