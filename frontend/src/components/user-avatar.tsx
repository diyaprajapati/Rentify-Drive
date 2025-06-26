import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getSessionToken } from "@/lib/utils";
import axios from "axios";
import { Label } from "./ui/label";

export function UserAvatar() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getSessionToken();
        if (token) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 cursor-pointer">
      <Label className="text-base font-medium text-purple-400/90 cursor-pointer hover:text-purple-300">{user.name}</Label>
      <Avatar className="border-2 border-purple-400/50 hover:border-purple-400 transition-colors">
        <AvatarFallback className="bg-purple-900/50 text-purple-200">
          {user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
