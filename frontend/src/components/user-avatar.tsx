import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getSessionToken } from "@/lib/utils";
import axios from "axios";

export function UserAvatar() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getSessionToken();
        if (token) {
          const response = await axios.get(
            "http://localhost:3001/users/profile",
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
    <Avatar>
      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
