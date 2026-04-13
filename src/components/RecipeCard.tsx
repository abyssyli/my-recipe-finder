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

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      setIsSaved(!newSavedStatus);
    }
  };

  return (
    <div className="apple-card group cursor-pointer bg-white">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
        
        <button
          onClick={handleSave}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
            isSaved 
              ? "bg-[#0071e3] text-white" 
              : "bg-white/80 text-[#1d1d1f] hover:bg-white hover:scale-110"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isSaved ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0071e3]">
            {recipe.strCategory}
          </span>
          <span className="text-[10px] font-medium text-[#86868b]">•</span>
          <span className="text-[10px] font-medium text-[#86868b] uppercase tracking-wider">
            {recipe.strArea}
          </span>
        </div>
        <h3 className="text-[19px] font-semibold text-[#1d1d1f] leading-tight mb-2 group-hover:text-[#0071e3] transition-colors">
          {recipe.strMeal}
        </h3>
        <p className="text-[14px] text-[#86868b] line-clamp-2 leading-relaxed">
          {recipe.strInstructions || "Tap to see the full recipe and ingredients."}
        </p>
      </div>
    </div>
  );
}
