import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAdminPizza } from "../services/adminService";

export function useUpdateAdminPizza() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminPizza,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "pizzas"],
      });
    },
  });
}
