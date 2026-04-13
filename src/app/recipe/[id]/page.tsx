import Image from "next/image";
import { getRecipeById } from "@/lib/mealdb";
import Link from "next/link";
import { notFound } from "next/navigation";

interface RecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe || !recipe.idMeal) {
    notFound();
  }

  // Extract ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = (recipe as any)[`strIngredient${i}`];
    const measure = (recipe as any)[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure });
    }
  }

  // Extract tags
  const tags = recipe.strTags ? recipe.strTags.split(",").map(tag => tag.trim()) : [];

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-8 md:py-20 space-y-12 md:space-y-16">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center text-[14px] font-medium text-[#0071e3] hover:underline mb-2 md:mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Discover
      </Link>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="apple-card relative aspect-square w-full overflow-hidden">
          {recipe.strMealThumb ? (
            <Image
              src={recipe.strMealThumb}
              alt={recipe.strMeal || "Recipe Image"}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No Image Available</span>
            </div>
          )}
        </div>
        
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-full">
                {recipe.strCategory}
              </span>
              <span className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider">
                {recipe.strArea}
              </span>
              {tags.map((tag, idx) => (
                <span key={idx} className="text-[12px] font-medium text-[#86868b] bg-[#f5f5f7] px-2 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="text-[32px] md:text-[48px] font-bold text-[#1d1d1f] leading-tight tracking-tight">
              {recipe.strMeal}
            </h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-[20px] md:text-[24px] font-bold text-[#1d1d1f] tracking-tight border-b border-[#d2d2d7]/30 pb-4">
              Ingredients
            </h2>
            <ul className="grid grid-cols-1 gap-3">
              {ingredients.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b border-[#d2d2d7]/10">
                  <span className="text-[15px] md:text-[17px] text-[#1d1d1f] font-medium">{item.ingredient}</span>
                  <span className="text-[15px] md:text-[17px] text-[#86868b]">{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Video Link */}
          {recipe.strYoutube && (
            <div className="pt-4">
              <a 
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-button-primary inline-flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                <span>Watch on YouTube</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Instructions */}
      <section className="space-y-6 md:space-y-8 max-w-[800px]">
        <h2 className="text-[28px] md:text-[32px] font-bold text-[#1d1d1f] tracking-tight">Instructions</h2>
        <div className="space-y-4 md:space-y-6">
          {recipe.strInstructions ? (
            recipe.strInstructions
              .split(/\r?\n|\r/)
              .filter(p => p.trim())
              .map((paragraph, index) => (
                <p key={index} className="text-[17px] md:text-[19px] text-[#1d1d1f]/90 leading-relaxed font-normal">
                  {paragraph}
                </p>
              ))
          ) : (
            <p className="text-[17px] md:text-[19px] text-[#86868b] italic">No instructions available for this recipe.</p>
          )}
        </div>
      </section>
    </div>
  );
}
