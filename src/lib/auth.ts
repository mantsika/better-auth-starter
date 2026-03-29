import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || window.location.origin,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    twoFactorClient({
      twoFactorPage: "/auth/two-factor",
    }),
  ],
});
