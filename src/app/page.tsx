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

  const handleSaveToggle = async (recipe: Recipe) => {
    // We'll implement the actual Supabase save logic later
    console.log("Toggling save for recipe:", recipe.strMeal);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Find Your Next <span className="text-orange-600">Favorite Meal</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Search thousands of recipes, plan your meals, and save the ones you love.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a recipe (e.g., 'Pasta', 'Chicken')..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm text-lg"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-700 transition"
          >
            Search
          </button>
        </form>
      </section>

      {/* Recipe Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {query ? `Search results for "${query}"` : "Recommended for You"}
          </h2>
          {loading && (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
          )}
        </div>

        {!loading && recipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No recipes found. Try searching for something else!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe.idMeal} 
                recipe={recipe} 
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
