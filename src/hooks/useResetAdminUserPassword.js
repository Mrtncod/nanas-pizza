import { useMutation } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

export function useResetAdminUserPassword() {
  return useMutation({
    mutationFn: async (userId) => {
      const { data, error } = await supabase.functions.invoke("admin-users", {
        body: {
          action: "reset-password",
          userId,
        },
      });

      if (error) {
        // Supabase may put the Edge Function's error message
        // inside the response context.
        let message = error.message;

        try {
          const response = await error.context?.json();

          if (response?.error) {
            message = response.error;
          }
        } catch {
          // Keep the original error message.
        }

        throw new Error(message);
      }

      if (!data?.success) {
        throw new Error(
          data?.error || "Could not send the password reset email.",
        );
      }

      return data;
    },
  });
}
