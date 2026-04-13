"use client";

import Image from "next/image";
import { Recipe } from "@/lib/mealdb";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toggleSaveRecipe, isRecipeSaved } from "@/app/actions";

interface RecipeCardProps {
  recipe: Recipe;
  isSaved?: boolean;
  onSaveToggle?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, isSaved: initialIsSaved, onSaveToggle }: RecipeCardProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved || false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    async function checkSavedStatus() {
      if (isSignedIn && !initialIsSaved) {
        const saved = await isRecipeSaved(recipe.idMeal);
        setIsSaved(saved);
      }
    }
    checkSavedStatus();
  }, [isSignedIn, recipe.idMeal, initialIsSaved]);

  const handleSave = async () => {
    if (!isSignedIn) {
      alert("Please sign in to save recipes");
      return;
    }
    
    const newSavedStatus = !isSaved;
    setIsSaved(newSavedStatus);
    
    try {
      await toggleSaveRecipe(recipe);
      if (onSaveToggle) {
        onSaveToggle(recipe);
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
      setIsSaved(!newSavedStatus); // Revert on failure
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-gray-100 group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition ${
              isSaved 
                ? "bg-orange-600 text-white" 
                : "bg-white/80 text-gray-600 hover:text-orange-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isSaved ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-2 py-1 bg-orange-50 text-orange-600 rounded-full">
            {recipe.strCategory}
          </span>
          <span className="text-xs text-gray-500">{recipe.strArea}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{recipe.strMeal}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {recipe.strInstructions || "No instructions available."}
        </p>
        <button className="w-full py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition duration-200 border border-gray-100">
          View Details
        </button>
      </div>
    </div>
  );
}
