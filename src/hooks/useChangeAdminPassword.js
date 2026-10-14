import { useMutation } from "@tanstack/react-query";

import { supabase } from "../services/supabase";

async function changeAdminPassword({ email, currentPassword, newPassword }) {
  // Verify the current password first.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error("Your current password is incorrect.");
  }

  // Update the password through Supabase Auth.
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    throw updateError;
  }

  return true;
}

export function useChangeAdminPassword() {
  return useMutation({
    mutationFn: changeAdminPassword,
  });
}
