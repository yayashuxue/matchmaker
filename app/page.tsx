import LoginButton from "@/components/auth/LoginButton";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-8 h-8 text-pink-500" />
          <h1 className="text-4xl font-bold">Matchmaker</h1>
        </div>
        <p className="text-gray-600 max-w-md">
          Help your friends find love by making meaningful connections
        </p>
      </div>

      <div className="w-full max-w-sm">
        <LoginButton />
      </div>
    </div>
  );
}
