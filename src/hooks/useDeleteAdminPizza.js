import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAdminPizza } from "../services/adminService";

export function useDeleteAdminPizza() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminPizza,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "pizzas"],
      });
    },
  });
}
