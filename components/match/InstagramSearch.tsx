import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Instagram, Loader2, AlertCircle, User } from "lucide-react";

interface InstagramProfile {
  username: string;
  fullName: string;
  followers: number;
  following: number;
  profilePic?: string;
}

export function InstagramSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (details: { instagram: string; name?: string }) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const username = value.replace("@", "").trim();
      if (!username || username.length < 2) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/instagram?username=${username}`);

        if (!response.ok) {
          throw new Error("Profile not found");
        }

        const data = await response.json();
        setProfile(data);
        onChange({
          instagram: username,
          name: data.fullName,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Could not find profile");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProfile, 500);
    return () => clearTimeout(timer);
  }, [value, onChange]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange({ instagram: e.target.value })}
          placeholder="Instagram handle"
          className="pl-9"
        />
        <Instagram
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        {loading && (
          <Loader2
            className="absolute right-2 top-1/2 transform -translate-y-1/2 animate-spin text-gray-400"
            size={20}
          />
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {profile && (
        <Card className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {profile.profilePic ? (
              <img
                src={`/api/instagram-image?url=${encodeURIComponent(
                  profile.profilePic
                )}`}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-gray-400" />
            )}{" "}
          </div>
          <div>
            <p className="font-medium">
              {profile.fullName || `@${profile.username}`}
            </p>
            <p className="text-sm text-gray-500">@{profile.username}</p>
            <p className="text-xs text-gray-400">
              {profile.followers?.toLocaleString()} followers ·{" "}
              {profile.following?.toLocaleString()} following
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}