import { useQuery } from "@tanstack/react-query";

import { getAdminSalesPaymentPerformance } from "../services/adminService";

export function useAdminSalesPaymentPerformance({
  startDate = null,
  endDate = null,
} = {}) {
  return useQuery({
    queryKey: [
      "admin",
      "sales",
      "payment-performance",
      {
        startDate,
        endDate,
      },
    ],
    queryFn: () =>
      getAdminSalesPaymentPerformance({
        startDate,
        endDate,
      }),
  });
}
