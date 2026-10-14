import { useQuery } from "@tanstack/react-query";

import { getAdminOrders } from "../services/adminService";

export function useAdminOrders({
  page,
  pageSize,
  search,
  status,
  payment,
  dateRange,
}) {
  return useQuery({
    queryKey: [
      "admin",
      "orders",
      {
        page,
        pageSize,
        search,
        status,
        payment,
        dateRange,
      },
    ],

    queryFn: () =>
      getAdminOrders({
        page,
        pageSize,
        search,
        status,
        payment,
        dateRange,
      }),

    placeholderData: (previousData) => previousData,
  });
}

// import { useQuery } from "@tanstack/react-query";

// import { getAdminOrders } from "../services/adminService";

// export function useAdminOrders() {
//   return useQuery({
//     queryKey: ["admin", "orders"],
//     queryFn: getAdminOrders,
//   });
// }
