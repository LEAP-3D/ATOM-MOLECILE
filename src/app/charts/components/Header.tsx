"use client";

import type { FC } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

export const Header: FC = () => {
  return (
    <header className="
      h-16 
      w-full
      flex items-center justify-between 
      px-6
      bg-white/5 
      backdrop-blur-xl
      border-b border-white/10
      shadow-lg
    ">
      {/* Left: Search */}
      <div className="relative w-72">
        <Search
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Type anywhere to search..."
          className="
            w-full 
            rounded-lg 
            bg-white/10
            border border-white/10
            py-2 pl-12 pr-4 
            text-sm 
            text-gray-100 
            placeholder:text-gray-400
            focus:outline-none 
            focus:ring-2 
            focus:ring-purple-500/60
            focus:border-transparent 
            transition
          "
          aria-label="Search"
        />
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-6">
        <div
          className="relative flex items-center cursor-pointer group justify-end overflow-hidden w-44"
          role="button"
          tabIndex={0}
          aria-label="User profile menu"
        >
          <div className="flex items-center gap-3 transition-all duration-300">
            {/* Name */}
            <div className="flex flex-col text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-semibold text-gray-100 leading-tight">
                Nancy Livon
              </p>
              <p className="text-xs text-gray-400 leading-tight">
                Data Supervisor Senior
              </p>
            </div>

            {/* Profile Image */}
            <Image
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nancy"
              alt="Nancy Livon"
              width={40}
              height={40}
              className="rounded-full border border-white/20 shadow-md"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
