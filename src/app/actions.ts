"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Recipe } from "@/lib/mealdb";
import { revalidatePath } from "next/cache";

export async function toggleSaveRecipe(recipe: Recipe) {
  try {
    const authData = await auth();
    const { userId } = authData;
    
    console.log("ToggleSave: Auth Data", { userId, hasSession: !!authData.sessionId });

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Check if already saved
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("saved_recipes")
      .select("id")
      .eq("user_id", userId)
      .eq("recipe_id", recipe.idMeal)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      throw fetchError;
    }

    if (existing) {
      // Delete if exists
      const { error: deleteError } = await supabaseAdmin
        .from("saved_recipes")
        .delete()
        .eq("user_id", userId)
        .eq("recipe_id", recipe.idMeal);
      
      if (deleteError) {
        console.error("Supabase delete error:", deleteError);
        throw deleteError;
      }
    } else {
      // Insert if not exists
      const { error: insertError } = await supabaseAdmin
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
      
      if (insertError) {
        console.error("Supabase insert error:", insertError);
        throw insertError;
      }
    }

    revalidatePath("/saved");
    revalidatePath("/");
  } catch (error) {
    console.error("toggleSaveRecipe failed:", error);
    throw error;
  }
}

export async function getSavedRecipes() {
  const { userId } = await auth();
  
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
  try {
    const authData = await auth();
    const { userId } = authData;
    
    if (!userId) {
      return false;
    }

    const { data, error } = await supabaseAdmin
      .from("saved_recipes")
      .select("id")
      .eq("user_id", userId)
      .eq("recipe_id", recipeId)
      .maybeSingle();

    if (error) {
      console.error("isRecipeSaved error:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("isRecipeSaved unexpected error:", error);
    return false;
  }
}
