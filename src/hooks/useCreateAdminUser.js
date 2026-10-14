import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../services/supabase";

async function createAdminUser({ fullName, email, role }) {
  const { data, error } = await supabase.functions.invoke("admin-users", {
    body: {
      action: "create",
      fullName,
      email,
      role,
    },
  });

  if (error) {
    throw new Error(`Could not create user: ${error.message}`);
  }

  if (!data?.success) {
    throw new Error(data?.error || "Could not create user.");
  }

  return data.user;
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminUser,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
    },
  });
}
