import BusinessWorkspace from "@/pages/BusinessWorkspace";

export default function OverviewPage({ params }: { params: { id: string } }) {
  return <BusinessWorkspace params={params} />;
}
