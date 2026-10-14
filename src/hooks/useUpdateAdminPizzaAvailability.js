import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAdminPizzaAvailability } from "../services/adminService";

export function useUpdateAdminPizzaAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pizzaId, soldOut }) =>
      updateAdminPizzaAvailability(pizzaId, soldOut),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "pizzas"],
      });
    },
  });
}
