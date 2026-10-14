import { useQuery } from "@tanstack/react-query";

import { getAdminSalesPizzaPerformance } from "../services/adminService";

export function useAdminSalesPizzaPerformance({
  startDate = null,
  endDate = null,
} = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "sales",
      "pizza-performance",
      {
        startDate,
        endDate,
      },
    ],
    queryFn: () =>
      getAdminSalesPizzaPerformance({
        startDate,
        endDate,
      }),
  });
}
