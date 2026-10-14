import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateStaffOrderStatus } from "../services/staffService";

export function useUpdateStaffOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStaffOrderStatus,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["staff", "orders"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["staff", "dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["staff", "order"],
        }),
      ]);
    },
  });
}
