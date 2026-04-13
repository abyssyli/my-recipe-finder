"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Recipe } from "@/lib/mealdb";
import { revalidatePath } from "next/cache";

export async function toggleSaveRecipe(recipe: Recipe) {
  const authData = auth();
  const { userId } = authData;
  
  console.log("ToggleSave: Auth Data", { userId, hasSession: !!authData.sessionId });

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check if already saved
  const { data: existing } = await supabaseAdmin
    .from("saved_recipes")
    .select("id")
    .eq("user_id", userId)
    .eq("recipe_id", recipe.idMeal)
    .single();

  if (existing) {
    // Delete if exists
    const { error } = await supabaseAdmin
      .from("saved_recipes")
      .delete()
      .eq("user_id", userId)
      .eq("recipe_id", recipe.idMeal);
    
    if (error) throw error;
  } else {
    // Insert if not exists
    const { error } = await supabaseAdmin
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
  
  if (!userId) {
    return [];
  }

  const { data, error } = await supabaseAdmin
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
  
  if (!userId) {
    return false;
  }

  const { data } = await supabaseAdmin
    .from("saved_recipes")
    .select("id")
    .eq("user_id", userId)
    .eq("recipe_id", recipeId)
    .single();

  return !!data;
}
