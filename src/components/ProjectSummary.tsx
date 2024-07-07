import ProgressCalculator from "@/components/ProgressCalculator";
import { Business } from "@/types";

const ProjectSummary = ({ business }: { business: Business }) => {
  function sendToTaskBoard() {
    window.location.href = `/business/${business.id}/task-board`;
  }
  return (
    <div
      className="border p-4 rounded-lg shadow cursor-pointer hover:bg-slate-100 transition-colors duration-200 ease-in-out"
      onClick={sendToTaskBoard}
    >
      <h2 className="text-xl font-bold mb-2">Project Summary</h2>
      <p>{business.description}</p>
      <div className="mt-2">
        <p>
          <strong>Type:</strong> {business.type}
        </p>
        <div>
          <ProgressCalculator businessId={business.id} />
        </div>
      </div>
    </div>
  );
};

export default ProjectSummary;
