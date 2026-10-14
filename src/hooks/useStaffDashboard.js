import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../services/supabase";
import { getStaffDashboardOrders } from "../services/staffService";

export function useStaffDashboard() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("staff-dashboard-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["staff", "dashboard"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["staff", "dashboard"],
    queryFn: getStaffDashboardOrders,
  });
}
