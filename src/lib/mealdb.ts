export const THEMEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strTags?: string;
  strYoutube?: string;
  strSource?: string;
  [key: string]: string | undefined; // For dynamic ingredient/measure fields
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const response = await fetch(`${THEMEALDB_BASE_URL}/search.php?s=${query}`);
  const data = await response.json();
  return data.meals || [];
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const response = await fetch(`${THEMEALDB_BASE_URL}/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals ? data.meals[0] : null;
}

export async function getRandomRecipes(count: number = 6): Promise<Recipe[]> {
  const recipes: Recipe[] = [];
  for (let i = 0; i < count; i++) {
    const response = await fetch(`${THEMEALDB_BASE_URL}/random.php`);
    const data = await response.json();
    if (data.meals && data.meals[0]) {
      recipes.push(data.meals[0]);
    }
  }
  return recipes;
}
