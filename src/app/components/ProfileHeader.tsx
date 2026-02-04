import React from "react";

export default function Header() {
  return (
    <div className="flex gap-8 mb-16 flex-wrap">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-1">
          <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center font-bold text-2xl">
            PG
          </div>
        </div>
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          pinegraphic <span>✓</span>
        </h1>

        <p className="text-gray-400 mt-2">📍 Ulaanbaatar</p>

        <div className="mt-4 px-6 py-3 bg-gray-800 rounded-xl inline-block">
          Total prompts <b className="ml-3 text-xl">145</b>
        </div>
      </div>
    </div>
  );
}

