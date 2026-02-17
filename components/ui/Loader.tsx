"use client";
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full py-6">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
