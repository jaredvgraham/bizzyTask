import React from "react";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="spinner">Loading...</div>
    </div>
  );
};

export default Loading;
