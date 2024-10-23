"use client";

import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();

  // Handle post-login navigation
  useEffect(() => {
    if (authenticated && user && user.id) {
      // Only redirect if on home page
      if (pathname === "/") {
        window.location.href = "/match"; // Using window.location for full page refresh
      }
    }
  }, [user, authenticated, pathname]);

  // Handle login click
  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Button
      onClick={authenticated ? logout : handleLogin}
      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 
                 hover:from-pink-600 hover:to-purple-600"
      disabled={!ready}
    >
      {authenticated ? "Logout" : "Create Account or Login"}
    </Button>
  );
}
