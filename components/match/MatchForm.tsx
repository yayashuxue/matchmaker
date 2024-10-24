"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InstagramSearch } from "./InstagramSearch";
import { MessageSquare, Heart, ArrowRight, Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

interface Profile {
  instagram: string;
  name?: string;
}

type MatchStep = "person1" | "person2" | "reason" | "confirm" | "success";

export function MatchForm() {
  const { user } = usePrivy();
  const [currentStep, setCurrentStep] = useState<MatchStep>("person1");
  const [person1, setPerson1] = useState<Profile>({ instagram: "" });
  const [person2, setPerson2] = useState<Profile>({ instagram: "" });
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);

  const [shareLinks, setShareLinks] = useState({
    person1: "",
    person2: "",
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUser: user,
          person1,
          person2,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create match");
      }

      const data = await response.json();
      setMatchId(data.match.id);
      setShareLinks(data.shareLinks);
      setCurrentStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (recipientType: "person1" | "person2") => {
    if (!matchId) return;

    const recipient = recipientType === "person1" ? person1 : person2;
    const otherPerson = recipientType === "person1" ? person2 : person1;

    // 使用 matchId 和对应的 token 生成链接
    const matchLink = `${window.location.origin}${shareLinks[recipientType]}`;


    const message = `Hey! I think you and @${otherPerson.instagram} would be great together! ✨

  Click here to see why: ${matchLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Matchmaker",
          text: message,
          url: matchLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // 如果不支持 navigator.share，可以复制链接到剪贴板并提示用户
      try {
        await navigator.clipboard.writeText(message);
        alert(
          "Message copied to clipboard! You can paste it into any messaging app."
        );
      } catch (error) {
        console.error("Failed to copy:", error);
        alert("Unable to share. Please copy the message manually.");
      }
    }
  };

  if (currentStep === "success") {
    return (
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-2">
            <Heart className="w-12 h-12 text-pink-500 mx-auto" />
            <h3 className="text-xl font-medium">Match Created!</h3>
            <p className="text-gray-600">Time to let them know!</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => handleShare("person1")}
              className="w-full gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Text to {person1.name || `@${person1.instagram}`}
            </Button>
            <Button
              onClick={() => handleShare("person2")}
              className="w-full gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Text to {person2.name || `@${person2.instagram}`}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setPerson1({ instagram: "" });
                setPerson2({ instagram: "" });
                setReason("");
                setCurrentStep("person1");
              }}
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
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">First Person</h3>
              {currentStep !== "person1" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep("person1")}
                >
                  Edit
                </Button>
              )}
            </div>
            {currentStep === "person1" ? (
              <>
                <InstagramSearch
                  value={person1.instagram}
                  onChange={setPerson1}
                />
                <Button
                  onClick={() => setCurrentStep("person2")}
                  disabled={!person1.instagram}
                  className="w-full"
                >
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                @{person1.instagram}
              </div>
            )}
          </div>

          {(currentStep === "person2" ||
            currentStep === "reason" ||
            currentStep === "confirm") && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Second Person</h3>
                {currentStep !== "person2" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep("person2")}
                  >
                    Edit
                  </Button>
                )}
              </div>
              {currentStep === "person2" ? (
                <>
                  <InstagramSearch
                    value={person2.instagram}
                    onChange={setPerson2}
                  />
                  <Button
                    onClick={() => setCurrentStep("reason")}
                    disabled={!person2.instagram}
                    className="w-full"
                  >
                    Next <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">
                  @{person2.instagram}
                </div>
              )}
            </div>
          )}

          {(currentStep === "reason" || currentStep === "confirm") && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  Why would they be great together?
                </h3>
                {currentStep !== "reason" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep("reason")}
                  >
                    Edit
                  </Button>
                )}
              </div>
              {currentStep === "reason" ? (
                <>
                  <Textarea
                    placeholder="What makes them a perfect match?"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={() => setCurrentStep("confirm")}
                    disabled={!reason.trim()}
                    className="w-full"
                  >
                    Review Match <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">{reason}</div>
              )}
            </div>
          )}

          {currentStep === "confirm" && (
            <div className="space-y-4">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Match...
                  </>
                ) : (
                  <>
                    Create Match
                    <Heart className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
