import { useQuery } from "@tanstack/react-query";

import { getAdminSalesTrend } from "../services/adminService";

export function useAdminSalesTrend({ startDate = null, endDate = null } = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "sales",
      "trend",
      {
        startDate,
        endDate,
      },
    ],
    queryFn: () =>
      getAdminSalesTrend({
        startDate,
        endDate,
      }),
  });
}
