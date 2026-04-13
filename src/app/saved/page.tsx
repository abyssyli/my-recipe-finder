"use client";

import { getSavedRecipes } from "@/app/actions";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/lib/mealdb";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setRecipesFiltered] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    async function loadRecipes() {
      const savedItems = await getSavedRecipes();
      const formattedRecipes: Recipe[] = savedItems.map((item: any) => ({
        idMeal: item.recipe_id,
        strMeal: item.recipe_name,
        strMealThumb: item.recipe_image,
        strCategory: item.category || "",
        strArea: item.area || "",
        strInstructions: item.instructions_preview || "",
        createdAt: item.created_at, // Keep for sorting
      }));
      setRecipes(formattedRecipes);
      setRecipesFiltered(formattedRecipes);
      setLoading(false);
    }
    loadRecipes();
  }, []);

  useEffect(() => {
    let result = [...recipes];

    // Filtering
    if (filterCategory !== "all") {
      result = result.filter(r => r.strCategory === filterCategory);
    }

    // Sorting
    if (sortBy === "newest") {
      result.sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date((a as any).createdAt).getTime() - new Date((b as any).createdAt).getTime());
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    }

    setRecipesFiltered(result);
  }, [recipes, sortBy, filterCategory]);

  const categories = ["all", ...Array.from(new Set(recipes.map(r => r.strCategory).filter(Boolean)))];

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0071e3] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-16 space-y-10 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight">Your Collections</h1>
          <p className="text-[15px] md:text-[17px] text-[#86868b] font-medium">{recipes.length} recipes saved</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] md:text-[12px] font-semibold text-[#86868b] uppercase tracking-wider whitespace-nowrap">Category:</span>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-[#d2d2d7] rounded-lg px-2.5 py-1.5 text-[13px] md:text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === "all" ? "All" : cat}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] md:text-[12px] font-semibold text-[#86868b] uppercase tracking-wider whitespace-nowrap">Sort:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#d2d2d7] rounded-lg px-2.5 py-1.5 text-[13px] md:text-[14px] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20 md:py-32 bg-white rounded-[24px] md:rounded-[32px] border border-[#d2d2d7]/30 shadow-sm px-6">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-[#f5f5f7] w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-[#86868b]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-[20px] md:text-[24px] font-bold text-[#1d1d1f]">No recipes found</h2>
              <p className="text-[#86868b] text-[15px] md:text-[17px]">Try adjusting your filters or save more recipes.</p>
            </div>
            {recipes.length === 0 && (
              <Link href="/" className="apple-button-primary inline-block">Start Exploring</Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredRecipes.map((recipe) => (
            <RecipeCard 
              key={recipe.idMeal} 
              recipe={recipe} 
              isSaved={true}
              onSaveToggle={() => {
                // Refresh list when unsaved
                getSavedRecipes().then(items => {
                  const formatted = items.map((item: any) => ({
                    idMeal: item.recipe_id,
                    strMeal: item.recipe_name,
                    strMealThumb: item.recipe_image,
                    strCategory: item.category || "",
                    strArea: item.area || "",
                    strInstructions: item.instructions_preview || "",
                    createdAt: item.created_at,
                  }));
                  setRecipes(formatted);
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
