import BusinessWorkspace from "@/pages/BusinessWorkspace";
import OverviewPage from "@/pages/OverviewPage";

export default function page({ params }: { params: { id: string } }) {
  return <OverviewPage params={params} />;
}
