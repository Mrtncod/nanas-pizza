import { useQuery } from "@tanstack/react-query";

import { getAdminSalesSummary } from "../services/adminService";

export function useAdminSalesSummary({
  startDate = null,
  endDate = null,
} = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "sales",
      "summary",
      {
        startDate,
        endDate,
      },
    ],
    queryFn: () =>
      getAdminSalesSummary({
        startDate,
        endDate,
      }),
  });
}
