import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05050a] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold text-amber-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-zinc-400 max-w-md mb-6">
        The requested HoloKai landing page path does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
