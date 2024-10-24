"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cm2lp8oio04h912z306zxr7t6"
      config={{
        loginMethods: ["email", "google", "sms"],
        appearance: {
          theme: "light",
          accentColor: "#FF5757",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
