"use client";

import { useState, useEffect } from "react";
import { Recipe, searchRecipes, getRandomRecipes } from "@/lib/mealdb";
import RecipeCard from "@/components/RecipeCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialRecipes() {
      const initialRecipes = await getRandomRecipes(8);
      setRecipes(initialRecipes);
      setLoading(false);
    }
    loadInitialRecipes();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    const results = await searchRecipes(query);
    setRecipes(results);
    setLoading(false);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-10 space-y-6">
        <h1 className="text-[56px] md:text-[72px] font-bold text-[#1d1d1f] tracking-tight leading-[1.1]">
          Fresh ideas for<br />
          <span className="text-[#0071e3]">every meal.</span>
        </h1>
        <p className="text-[19px] md:text-[21px] text-[#86868b] max-w-[600px] mx-auto font-medium leading-relaxed">
          Discover thousands of world-class recipes, all in one place.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-[500px] mx-auto mt-10 relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes"
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all duration-300 text-[17px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] w-5 h-5 transition-colors group-focus-within:text-[#0071e3]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </form>
      </section>

      {/* Recipe Grid */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <h2 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">
              {query ? `Results for "${query}"` : "Today's Picks"}
            </h2>
            <p className="text-[14px] text-[#86868b] font-medium uppercase tracking-wider">
              {recipes.length} recipes found
            </p>
          </div>
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0071e3] border-t-transparent"></div>
          )}
        </div>

        {!loading && recipes.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[32px] shadow-sm">
            <p className="text-[#86868b] text-[19px] font-medium">No matches found. Try something else.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe.idMeal} 
                recipe={recipe} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
