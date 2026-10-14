import { useQuery } from "@tanstack/react-query";

import { getAdminSalesInsights } from "../services/adminService";

export function useAdminSalesInsights({
  startDate = null,
  endDate = null,
} = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "sales",
      "insights",
      {
        startDate,
        endDate,
      },
    ],
    queryFn: () =>
      getAdminSalesInsights({
        startDate,
        endDate,
      }),
  });
}
