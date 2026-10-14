import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../services/supabase";
import { getStaffOrders } from "../services/staffService";

export function useStaffOrders(page, pageSize = 10) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("staff-orders-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          // Refresh the cached staff order lists after a database change.
          queryClient.invalidateQueries({
            queryKey: ["staff", "orders"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["staff", "orders", page, pageSize],
    queryFn: () => getStaffOrders({ page, pageSize }),
  });
}
