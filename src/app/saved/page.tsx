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
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Your Saved Recipes</h1>
        <p className="text-gray-600">You have {recipes.length} recipes saved in your collection.</p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="max-w-md mx-auto space-y-4">
            <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-orange-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">No saved recipes yet</h2>
            <p className="text-gray-500">Start browsing and save your favorite meals to see them here!</p>
            <Link 
              href="/" 
              className="inline-block bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-200"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
