"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase";
import { Recipe } from "@/lib/mealdb";
import { revalidatePath } from "next/cache";

async function getSupabaseClient() {
  const { userId, getToken } = auth();
  
  if (!userId) {
    return null;
  }

  // Get Clerk JWT for Supabase RLS
  const token = await getToken({ template: 'supabase' });
  if (!token) {
    return null;
  }

  return createClerkSupabaseClient(token);
}

export async function toggleSaveRecipe(recipe: Recipe) {
  const { userId } = auth();
  const supabase = await getSupabaseClient();
  
  if (!userId || !supabase) {
    throw new Error("Unauthorized");
  }

  // Check if already saved
  const { data: existing } = await supabase
    .from("saved_recipes")
    .select("id")
    .eq("user_id", userId)
    .eq("recipe_id", recipe.idMeal)
    .single();

  if (existing) {
    // Delete if exists
    const { error } = await supabase
      .from("saved_recipes")
      .delete()
      .eq("user_id", userId)
      .eq("recipe_id", recipe.idMeal);
    
    if (error) throw error;
  } else {
    // Insert if not exists
    const { error } = await supabase
      .from("saved_recipes")
      .insert({
        user_id: userId,
        recipe_id: recipe.idMeal,
        recipe_name: recipe.strMeal,
        recipe_image: recipe.strMealThumb,
        category: recipe.strCategory,
        area: recipe.strArea,
        instructions_preview: recipe.strInstructions?.substring(0, 200),
      });
    
    if (error) throw error;
  }

  revalidatePath("/saved");
  revalidatePath("/");
}

export async function getSavedRecipes() {
  const { userId } = auth();
  const supabase = await getSupabaseClient();
  
  if (!userId || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_recipes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved recipes:", error);
    return [];
  }

  return data;
}

export async function isRecipeSaved(recipeId: string) {
  const { userId } = auth();
  const supabase = await getSupabaseClient();
  
  if (!userId || !supabase) {
    return false;
  }

  const { data } = await supabase
    .from("saved_recipes")
    .select("id")
    .eq("user_id", userId)
    .eq("recipe_id", recipeId)
    .single();

  return !!data;
}
