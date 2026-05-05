"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface GroupConfig {
  id: string;
  group_name: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getGroups(): Promise<GroupConfig[]> {
  try {
    const { data, error } = await supabase
      .from("groups_config")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching groups:", error);
    return [];
  }
}

export async function updateGroupCategory(
  id: string,
  category: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("groups_config")
      .update({ category })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating group category:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleGroupStatus(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("groups_config")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling group status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteGroup(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("groups_config")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting group:", error);
    return { success: false, error: error.message };
  }
}
