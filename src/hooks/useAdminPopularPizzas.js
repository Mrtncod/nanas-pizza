import { useQuery } from "@tanstack/react-query";

import { getAdminPopularPizzas } from "../services/adminService";

export function useAdminPopularPizzas() {
  return useQuery({
    queryKey: ["admin", "popular-pizzas"],
    queryFn: getAdminPopularPizzas,
  });
}
