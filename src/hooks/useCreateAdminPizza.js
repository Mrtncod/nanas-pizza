import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAdminPizza,
  uploadAdminPizzaImage,
} from "../services/adminService";

export function useCreateAdminPizza() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pizza, image }) => {
      const createdPizza = await createAdminPizza(pizza);

      if (!image) {
        return createdPizza;
      }

      return uploadAdminPizzaImage({
        pizzaId: createdPizza.id,
        file: image,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "pizzas"],
      });
    },
  });
}
