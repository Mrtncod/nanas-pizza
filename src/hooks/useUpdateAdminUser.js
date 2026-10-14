import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

async function updateAdminUser({ userId, fullName, role }) {
  const { data, error } = await supabase.functions.invoke("admin-users", {
    body: {
      action: "update",
      userId,
      fullName,
      role,
    },
  });

  if (error) {
    throw new Error(`Could not update user: ${error.message}`);
  }

  if (!data?.success) {
    throw new Error(data?.error || "Could not update user.");
  }

  return data.user;
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
    },
  });
}
