import { useQuery } from "@tanstack/react-query";

import { getAdminSalesComparison } from "../services/adminService";

export function useAdminSalesComparison({
  startDate = null,
  endDate = null,
} = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "sales",
      "comparison",
      {
        startDate,
        endDate,
      },
    ],
    queryFn: () =>
      getAdminSalesComparison({
        startDate,
        endDate,
      }),
  });
}
