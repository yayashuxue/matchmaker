// app/match/page.tsx
"use client";

import { usePrivy } from "@privy-io/react-auth";
import { MatchForm } from "@/components/match/MatchForm";
import { redirect } from "next/navigation";

export default function MatchPage() {
  const { authenticated, ready } = usePrivy();

  // Protect the route
  if (ready && !authenticated) {
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">Play Cupid</h1>
      <p className="text-center text-gray-600">
        Match your friends and help them find love
      </p>
      <MatchForm />
    </div>
  );
}
