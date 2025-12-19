import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Custom auth hook for Convex that uses the "convex" JWT template
 */
export function useConvexAuth() {
  const auth = useClerkAuth();

  return useMemo(
    () => ({
      ...auth,
      // Ensure we're getting a token from the "convex" JWT template
      getToken: async (options?: { template?: string }) => {
        return auth.getToken({ template: "convex", ...options });
      },
    }),
    [auth]
  );
}
