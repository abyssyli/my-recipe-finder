"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Header() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="glass sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex justify-between items-center h-[52px]">
          <div className="flex items-center space-x-10">
            <Link href="/" className="text-[19px] font-semibold tracking-tight hover:opacity-70 transition-opacity">
              Recipes
            </Link>
            <nav className="hidden md:flex items-center space-x-8 text-[12px] font-normal tracking-wide text-[#1d1d1f]/80">
              <Link href="/" className="hover:text-[#0071e3] transition-colors">Discover</Link>
              {isLoaded && isSignedIn && (
                <Link href="/saved" className="hover:text-[#0071e3] transition-colors">Collections</Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-6">
            {!isLoaded ? (
              <div className="h-6 w-6 animate-pulse bg-gray-200 rounded-full"></div>
            ) : !isSignedIn ? (
              <SignInButton mode="modal">
                <button className="text-[12px] font-normal text-[#0071e3] hover:underline transition-all">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <div className="scale-90">
                <UserButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
