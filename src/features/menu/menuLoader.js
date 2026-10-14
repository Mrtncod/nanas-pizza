import { getPizzas } from "../../services/pizzaService";

export async function loader() {
  const menu = await getPizzas();
  return menu;
}
