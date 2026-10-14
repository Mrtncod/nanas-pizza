import { useQuery } from "@tanstack/react-query";

import { getAdminPizzas } from "../services/adminService";

export function useAdminPizzas() {
  return useQuery({
    queryKey: ["admin", "pizzas"],
    queryFn: getAdminPizzas,
  });
}
