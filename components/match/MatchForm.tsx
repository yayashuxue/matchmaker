// components/match/MatchForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InstagramSearch } from "./InstagramSearch";
import { MessageSquare } from "lucide-react";

interface Profile {
  instagram: string;
  name?: string;
}

export function MatchForm() {
  const [person1, setPerson1] = useState<Profile>({ instagram: "" });
  const [person2, setPerson2] = useState<Profile>({ instagram: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleShare = (phone: string) => {
    const message = `Hey! Someone thinks you and @${person2.instagram} would be great together! What do you think? 💕`;
    window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-xl font-medium text-center">Time to share!</h3>
          <div className="space-y-4">
            <Button
              onClick={() => handleShare("phone_number_here")}
              className="w-full gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Text to {person1.name || `@${person1.instagram}`}
            </Button>
            <Button
              onClick={() => handleShare("phone_number_here")}
              className="w-full gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Text to {person2.name || `@${person2.instagram}`}
            </Button>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              className="w-full"
            >
              Make Another Match
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">First Person</h3>
            <InstagramSearch value={person1.instagram} onChange={setPerson1} />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Second Person</h3>
            <InstagramSearch value={person2.instagram} onChange={setPerson2} />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!person1.instagram || !person2.instagram}
          >
            Create Match
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
