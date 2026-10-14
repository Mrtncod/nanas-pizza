import { supabase } from "./supabase";

export async function getPizzas() {
  const { data, error } = await supabase.from("pizzas").select("*").order("id");
  if (error) {
    console.error(error);
    throw new error("Pizzas can not be loaded");
  }
  return data;
}
