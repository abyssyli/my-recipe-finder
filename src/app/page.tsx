"use client";

import { useState, useEffect } from "react";
import { Recipe, searchRecipes, getRandomRecipes } from "@/lib/mealdb";
import RecipeCard from "@/components/RecipeCard";
import { saveSearchHistory, getSearchHistory } from "@/app/actions";

export default function Home() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const [initialRecipes, searchHistory] = await Promise.all([
        getRandomRecipes(8),
        getSearchHistory()
      ]);
      setRecipes(initialRecipes);
      setHistory(searchHistory);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSearch = async (e: React.FormEvent | string) => {
    if (typeof e !== "string") e.preventDefault();
    const searchTerm = typeof e === "string" ? e : query;
    
    if (!searchTerm.trim()) return;
    
    if (typeof e !== "string") setQuery(searchTerm);
    setLoading(true);
    
    const [results] = await Promise.all([
      searchRecipes(searchTerm),
      saveSearchHistory(searchTerm)
    ]);
    
    setRecipes(results);
    const updatedHistory = await getSearchHistory();
    setHistory(updatedHistory);
    setLoading(false);
  };

  return (
    <div className="space-y-12 md:space-y-20 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-12 md:pt-20 pb-6 md:pb-10 space-y-4 md:space-y-6 px-6">
        <h1 className="text-[40px] md:text-[72px] font-bold text-[#1d1d1f] tracking-tight leading-[1.1]">
          Fresh ideas for<br className="hidden md:block" />
          <span className="text-[#0071e3]">every meal.</span>
        </h1>
        <p className="text-[17px] md:text-[21px] text-[#86868b] max-w-[600px] mx-auto font-medium leading-relaxed">
          Discover thousands of world-class recipes, all in one place.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-[500px] mx-auto mt-8 md:mt-10 relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes"
            className="w-full pl-10 md:pl-12 pr-28 md:pr-32 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#0071e3]/30 transition-all duration-300 text-[16px] md:text-[17px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          />
          <svg
            className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-[#86868b] w-4.5 md:h-5 w-4.5 md:w-5 transition-colors group-focus-within:text-[#0071e3]"
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
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0071e3] text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl font-semibold hover:bg-[#0077ed] transition text-[14px] md:text-[16px]"
          >
            Search
          </button>
        </form>

        {/* Search History */}
        {history.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-3 mt-4 md:mt-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <span className="text-[11px] md:text-[12px] font-semibold text-[#86868b] uppercase tracking-wider">Recent:</span>
            <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
              {history.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(item)}
                  className="text-[12px] md:text-[13px] font-medium text-[#0071e3] hover:bg-[#0071e3]/10 px-2.5 md:px-3 py-0.5 md:py-1 rounded-full transition-colors border border-[#0071e3]/20"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Recipe Grid */}
      <section className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
          <div className="space-y-1">
            <h2 className="text-[28px] md:text-[32px] font-bold text-[#1d1d1f] tracking-tight">
              {query ? `Results for "${query}"` : "Today's Picks"}
            </h2>
            <p className="text-[12px] md:text-[14px] text-[#86868b] font-medium uppercase tracking-wider">
              {recipes.length} recipes found
            </p>
          </div>
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0071e3] border-t-transparent"></div>
          )}
        </div>

        {!loading && recipes.length === 0 ? (
          <div className="text-center py-20 md:py-32 bg-white rounded-[24px] md:rounded-[32px] shadow-sm">
            <p className="text-[#86868b] text-[17px] md:text-[19px] font-medium">No matches found. Try something else.</p>
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
