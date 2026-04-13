"use client";

import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export default function Header() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-orange-600">
              RecipeFinder
            </Link>
            <nav className="hidden md:flex space-x-4 text-sm font-medium">
              <Link href="/" className="text-gray-600 hover:text-orange-600">Home</Link>
              {isLoaded && isSignedIn && (
                <Link href="/saved" className="text-gray-600 hover:text-orange-600">Saved Recipes</Link>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            {!isLoaded ? (
              <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full"></div>
            ) : !isSignedIn ? (
              <SignInButton mode="modal">
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
