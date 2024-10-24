// app/match/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, User, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

interface MatchDetail {
  id: string;
  person1: {
    id: string;
    name: string;
    instagram: string;
  };
  person2: {
    id: string;
    name: string;
    instagram: string;
  };
  matchmaker: {
    id: string;
    name: string;
    instagram: string;
  };
  reason: string;
  status: string;
  response1: string | null;
  response2: string | null;
  createdAt: string;
}

export default function MatchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = usePrivy();
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    fetchMatchDetails();
  }, [params.id]);

  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(`/api/match/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch match details");
      const data = await response.json();
      setMatch(data);
    } catch (err) {
      setError("Could not load match details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (response: "accept" | "decline") => {
    if (!match || !user) return;

    setResponding(true);
    try {
      const res = await fetch(`/api/match/${match.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });

      if (!res.ok) throw new Error("Failed to submit response");

      // Refresh match details
      await fetchMatchDetails();
    } catch (err) {
      setError("Failed to submit response");
      console.error(err);
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error || !match) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-red-500">{error || "Match not found"}</p>
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/")}
            className="mt-4"
          >
            Go Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 确定当前用户是否是匹配的一方
  const isParticipant =
    user && (match.person1.id === user.id || match.person2.id === user.id);

  // 确定当前用户是哪一方（如果是参与者）
  const userPosition =
    user && match.person1.id === user.id ? "person1" : "person2";
  const otherPerson =
    userPosition === "person1" ? match.person2 : match.person1;

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Heart className="text-pink-500" />
            Match Suggestion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 匹配者信息 */}
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="mt-2 font-medium">@{match.person1.instagram}</p>
            </div>

            <Heart className="w-8 h-8 text-pink-500" />

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="mt-2 font-medium">@{match.person2.instagram}</p>
            </div>
          </div>

          {/* 匹配原因 */}
          <div className="text-center">
            <p className="text-gray-600 italic">"{match.reason}"</p>
            <p className="text-sm text-gray-500 mt-2">
              - Suggested by @{match.matchmaker.instagram}
            </p>
          </div>

          {/* 响应按钮 */}
          {isParticipant &&
            !match[`response${userPosition === "person1" ? "1" : "2"}`] && (
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => handleResponse("accept")}
                  disabled={responding}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  I'm Interested
                </Button>
                <Button
                  onClick={() => handleResponse("decline")}
                  disabled={responding}
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Pass
                </Button>
              </div>
            )}

          {/* 匹配状态 */}
          {(match.response1 || match.response2) && (
            <div className="text-center text-sm text-gray-500">
              {match.response1 && (
                <p>
                  @{match.person1.instagram} has {match.response1}ed
                </p>
              )}
              {match.response2 && (
                <p>
                  @{match.person2.instagram} has {match.response2}ed
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
