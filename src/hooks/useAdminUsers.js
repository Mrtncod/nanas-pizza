import { useQuery } from "@tanstack/react-query";

import { supabase } from "../services/supabase";

async function getAdminUsers() {
  const { data, error } = await supabase.functions.invoke("admin-users", {
    body: {},
  });

  if (error) {
    throw new Error(`Could not load users: ${error.message}`);
  }

  if (!data?.success) {
    throw new Error(data?.error || "Could not load users.");
  }

  return data.users;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
  });
}
