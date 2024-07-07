import BusinessWorkspace from "@/pages/BusinessWorkspace";

export default function BusinessWorkspacePage({
  params,
}: {
  params: { id: string };
}) {
  return <BusinessWorkspace params={params} />;
}
