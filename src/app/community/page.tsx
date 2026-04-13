import { getCommunityRecipes } from "@/app/actions";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/lib/mealdb";

export default async function CommunityPage() {
  const communityItems = await getCommunityRecipes();

  const recipes: Recipe[] = communityItems.map((item: any) => ({
    idMeal: item.recipe_id,
    strMeal: item.recipe_name,
    strMealThumb: item.recipe_image,
    strCategory: item.category || "",
    strArea: item.area || "",
    strInstructions: item.instructions_preview || "",
  }));

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16 space-y-10 md:space-y-12">
      <div className="flex flex-col space-y-3">
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight">Community Picks</h1>
        <p className="text-[17px] text-[#86868b] font-medium max-w-[600px]">
          Discover recipes that other food lovers are saving to their collections right now.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 md:py-32 bg-white rounded-[24px] md:rounded-[32px] border border-[#d2d2d7]/30 shadow-sm">
          <p className="text-[#86868b] text-[17px]">No community recipes yet. Be the first to save one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {recipes.map((recipe, idx) => (
            <RecipeCard 
              key={`${recipe.idMeal}-${idx}`} 
              recipe={recipe} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
