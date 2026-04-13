"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function Header() {
  const { isLoaded, isSignedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <Link href="/community" className="hover:text-[#0071e3] transition-colors">Community</Link>
              {isLoaded && isSignedIn && (
                <Link href="/saved" className="hover:text-[#0071e3] transition-colors">Collections</Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              {!isLoaded ? (
                <div className="h-6 w-6 animate-pulse bg-gray-200 rounded-full"></div>
              ) : !isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="text-[12px] font-normal text-[#0071e3] hover:underline transition-all cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
              ) : (
                <div className="scale-90">
                  <UserButton />
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-[#1d1d1f]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[52px] left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-[#d2d2d7]/30 animate-in fade-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col p-6 space-y-4 text-[17px] font-medium">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-[#0071e3] transition-colors border-b border-[#d2d2d7]/10 pb-4"
            >
              Discover
            </Link>
            <Link 
              href="/community" 
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-[#0071e3] transition-colors border-b border-[#d2d2d7]/10 pb-4"
            >
              Community
            </Link>
            {isLoaded && isSignedIn && (
              <Link 
                href="/saved" 
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-[#0071e3] transition-colors border-b border-[#d2d2d7]/10 pb-4"
              >
                Collections
              </Link>
            )}
            <div className="pt-2">
              {!isLoaded ? (
                <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full"></div>
              ) : !isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="text-[#0071e3] font-semibold">Sign In</button>
                </SignInButton>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[#86868b] font-normal">Account</span>
                  <UserButton />
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
