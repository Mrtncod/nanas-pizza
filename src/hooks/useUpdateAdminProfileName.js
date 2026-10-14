import { useMutation } from "@tanstack/react-query";

import { updateAdminProfileName } from "../services/adminService";

export function useUpdateAdminProfileName() {
  return useMutation({
    mutationFn: ({ userId, fullName }) =>
      updateAdminProfileName(userId, fullName),
  });
}
