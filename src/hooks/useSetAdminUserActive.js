import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

async function setAdminUserActive({ userId, isActive }) {
  const { data, error } = await supabase.functions.invoke("admin-users", {
    body: {
      action: "set-active",
      userId,
      isActive,
    },
  });

  if (error) {
    throw new Error(`Could not update account status: ${error.message}`);
  }

  if (!data?.success) {
    throw new Error(data?.error || "Could not update account status.");
  }

  return data.user;
}

export function useSetAdminUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setAdminUserActive,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      }),
  });
}
