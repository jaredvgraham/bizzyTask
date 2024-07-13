import { useState, useEffect } from "react";

import { axiosPrivate } from "@/axios/axios";

const ProgressCalculator = ({ businessId }: { businessId: string }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const res = await axiosPrivate.get(`/business/${businessId}/progress`);
        setProgress(res.data.progress);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching progress: ", error);
        setLoading(false);
      }
    };
    fetchProgress();
  }, [businessId]);

  const getColor = (progress: number) => {
    if (progress < 30) return "bg-red-400 text-red-400";
    if (progress < 70) return "bg-yellow-500 text-yellow-500";
    return "bg-green-500 text-green-500";
  };

  if (loading) {
    return <div className="text-purple-400">Loading Progress...</div>;
  }

  return (
    <div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span
              className={`text-xs font-semibold inline-block py-1 px-2  rounded-full ${
                getColor(progress).split(" ")[1]
              }`}
            >
              Progress
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-semibold inline-block ${
                getColor(progress).split(" ")[1]
              }`}
            >
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              getColor(progress).split(" ")[0]
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCalculator;
