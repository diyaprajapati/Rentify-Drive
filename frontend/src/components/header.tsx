"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserAvatar } from "./user-avatar";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { getSessionToken } from "@/lib/utils";
import { googleLogout } from "@react-oauth/google";

export function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getSessionToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    googleLogout();
    localStorage.removeItem("loginData");
    router.push("/signin");
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          RentifyDrive
        </Link>
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link href="/settings">
                <UserAvatar />
              </Link>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <Link href="/signin">
              <Button>Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
