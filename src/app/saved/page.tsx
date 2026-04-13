import { getSavedRecipes } from "@/app/actions";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/lib/mealdb";
import Link from "next/link";

export default async function SavedRecipesPage() {
  const savedItems = await getSavedRecipes();

  // Convert Supabase items to Recipe format for the RecipeCard
  const recipes: Recipe[] = savedItems.map((item: { 
    recipe_id: string; 
    recipe_name: string; 
    recipe_image: string;
    category: string;
    area: string;
    instructions_preview: string;
  }) => ({
    idMeal: item.recipe_id,
    strMeal: item.recipe_name,
    strMealThumb: item.recipe_image,
    strCategory: item.category || "",
    strArea: item.area || "",
    strInstructions: item.instructions_preview || "",
  }));

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 space-y-12">
      <div className="flex flex-col space-y-2">
        <h1 className="text-[40px] font-bold text-[#1d1d1f] tracking-tight">Your Collections</h1>
        <p className="text-[17px] text-[#86868b] font-medium">{recipes.length} recipes saved</p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[32px] border border-[#d2d2d7]/30 shadow-sm">
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-[#f5f5f7] w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#86868b]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-[24px] font-bold text-[#1d1d1f]">Empty Collection</h2>
              <p className="text-[#86868b] text-[17px]">Save your favorite recipes to see them here.</p>
            </div>
            <Link 
              href="/" 
              className="apple-button-primary"
            >
              Start Exploring
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.idMeal} 
              recipe={recipe} 
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
