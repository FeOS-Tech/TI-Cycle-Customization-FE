import React from "react";

export default function HomeButtons({ navigate }) {
  return (
    <div
      className="
        grid grid-cols-1
        md:grid-cols-3
        gap-4 sm:gap-6
        max-w-6xl mx-auto
      "
    >
      <button
        onClick={() => navigate("/kids")}
        className="
          group w-full rounded-2xl
          px-4 py-3 sm:px-6 sm:py-5
          text-center
          bg-white/90 backdrop-blur-md
          shadow-[0_10px_30px_rgba(0,0,0,0.2)]
          border border-white/40
          hover:-translate-y-1
          hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]
          transition-all duration-300
        "
      >
        <h2 className="font-bold">KIDS</h2>
        <p className="text-sm text-gray-500">(Ages 3–8)</p>
      </button>

      <button
        onClick={() => navigate("/mtb")}
        className="
          group w-full rounded-2xl
          px-4 py-3 sm:px-6 sm:py-5
          text-center
          bg-white/90 backdrop-blur-md
          shadow-[0_10px_30px_rgba(0,0,0,0.2)]
          border border-white/40
          hover:-translate-y-1
          hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]
          transition-all duration-300
        "
      >
        <h2 className="font-bold">MTB</h2>
        <p className="text-sm text-gray-500">(Ages 8+)</p>
      </button>

      <button
        onClick={() => navigate("/inspired")}
        className="
          group w-full rounded-2xl
          px-4 py-3 sm:px-6 sm:py-5
          text-center
          bg-white/90 backdrop-blur-md
          shadow-[0_10px_30px_rgba(0,0,0,0.2)]
          border border-white/40
          hover:-translate-y-1
          hover:shadow-[0_15px_40px_rgba(0,0,0,0.25)]
          transition-all duration-300
        "
      >
        <h2 className="font-bold">Get Inspired</h2>
        <p className="text-sm text-gray-500">Explore designs</p>
      </button>
    </div>
  );
}
