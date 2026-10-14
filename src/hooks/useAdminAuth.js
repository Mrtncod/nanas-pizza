import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { getAdminProfile } from "../services/adminService";

export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminUser() {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }

        return;
      }

      try {
        const profile = await getAdminProfile(user.id);

        if (!isMounted) return;

        setUser(user);
        setProfile(profile);
      } catch (error) {
        console.error("Could not load admin profile:", error);

        if (!isMounted) return;

        setUser(user);
        setProfile(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }

      if (event === "SIGNED_IN" && session?.user) {
        loadAdminUser();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    isLoading,
    setProfile,
  };
}
