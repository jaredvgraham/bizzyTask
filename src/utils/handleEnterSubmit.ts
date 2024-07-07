// utils/handleEnterSubmit.ts
import React from "react";

const handleEnterSubmit = (
  event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  callback: () => void
) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default Enter key action
    callback();
  }
};

export default handleEnterSubmit;
