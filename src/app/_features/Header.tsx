"use client";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
export default function Header() {
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 sticky top-0 bg-white border-b z-50">
      <SignedOut>
        <div className="flex w-full h-full justify-between items-center px-4 sm:px-8">
          <div
            className="relative group overflow-hidden cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <div className="bg-linear-to-r from-chart-1 via-chart-2 to-chart-3 bg-size-[200%_auto] bg-clip-text text-transparent animate-gradient-x font-black text-3xl tracking-tighter">
              DataViz
            </div>
            <div className="h-1 w-0 group-hover:w-full transition-all duration-300 bg-linear-to-r from-chart-1 to-chart-3 rounded-full" />
          </div>
          <div className="flex gap-4">
            <SignInButton>
              <button className="px-4 sm:px-5 h-10 sm:h-12 text-sm sm:text-base font-medium rounded-full bg-black text-white hover:bg-gray-300 cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 sm:px-5 h-10 sm:h-12 text-sm sm:text-base font-medium rounded-full bg-black text-white hover:bg-gray-300 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn><div className="flex w-full h-full justify-between items-center px-4 sm:px-8"><div
            className="relative group overflow-hidden cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            <div className="bg-linear-to-r from-chart-1 via-chart-2 to-chart-3 bg-size-[200%_auto] bg-clip-text text-transparent animate-gradient-x font-black text-3xl tracking-tighter">
              DataViz
            </div>
            <div className="h-1 w-0 group-hover:w-full transition-all duration-300 bg-linear-to-r from-chart-1 to-chart-3 rounded-full" />
          </div>
        <UserButton /></div>
        
      </SignedIn>
    </header>
  );
}
