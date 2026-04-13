import Image from "next/image";
import { getRecipeById } from "@/lib/mealdb";
import Link from "next/link";
import { notFound } from "next/navigation";

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
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

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20 space-y-16">
      {/* Back Button */}
      <Link 
        href="/" 
        className="inline-flex items-center text-[14px] font-medium text-[#0071e3] hover:underline mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Discover
      </Link>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-12 items-start">
        <div className="apple-card relative aspect-square w-full">
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-full">
                {recipe.strCategory}
              </span>
              <span className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider">
                {recipe.strArea}
              </span>
            </div>
            <h1 className="text-[40px] md:text-[48px] font-bold text-[#1d1d1f] leading-tight tracking-tight">
              {recipe.strMeal}
            </h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-[24px] font-bold text-[#1d1d1f] tracking-tight border-b border-[#d2d2d7]/30 pb-4">
              Ingredients
            </h2>
            <ul className="grid grid-cols-1 gap-4">
              {ingredients.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b border-[#d2d2d7]/10">
                  <span className="text-[17px] text-[#1d1d1f] font-medium">{item.ingredient}</span>
                  <span className="text-[17px] text-[#86868b]">{item.measure}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="space-y-8 max-w-[800px]">
        <h2 className="text-[32px] font-bold text-[#1d1d1f] tracking-tight">Instructions</h2>
        <div className="space-y-6">
          {recipe.strInstructions.split('\r\n').filter(p => p.trim()).map((paragraph, index) => (
            <p key={index} className="text-[19px] text-[#1d1d1f]/90 leading-relaxed font-normal">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Video Button */}
      {/* {recipe.strYoutube && (
        <section className="pt-8">
          <a 
            href={recipe.strYoutube} 
            target="_blank" 
            rel="noopener noreferrer"
            className="apple-button-primary"
          >
            Watch Video Tutorial
          </a>
        </section>
      )} */}
    </div>
  );
}
