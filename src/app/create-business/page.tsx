import ProtectedRoute from "@/components/ProtectedRoute";
import CreateBusiness from "../../pages/CreateBusiness";

export default function CreateBusinessPage() {
  return (
    <ProtectedRoute>
      <CreateBusiness />
    </ProtectedRoute>
  );
}
