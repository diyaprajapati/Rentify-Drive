"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import Particles from "@/components/particles";
import AnimatedGradientText from "@/components/animated-gradient-text";

export default function SignupForm() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [loginData, setLoginData] = useState(null);
  const { push } = useRouter();

  const handleLogin = async (googleData: any) => {
    try {
      console.log(googleData);
      const res = await fetch("http://localhost:3001/api/google-login", {
        method: "POST",
        body: JSON.stringify({ token: googleData.credential }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Failed to log in with Google");
      }
      const data = await res.json();
      setLoginData(data);
      await localStorage.setItem("loginData", JSON.stringify(data));
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      setLoginData(JSON.parse(loginData));
    }
  }, []);

  useEffect(() => {
    if (loginData) {
      //@ts-ignore
      const decodedUser = jwtDecode(loginData.sessionToken);
      if (decodedUser) {
        push("/home");
      }
    }
  }, [loginData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden relative">
      <Particles />
      <div className="relative z-10 h-screen w-full flex flex-col justify-center items-center p-4">
        <div className="mb-8">
          <AnimatedGradientText>
            <span className="inline animate-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
              Join Rentify Drive
            </span>
          </AnimatedGradientText>
        </div>

        <Card className="mx-auto max-w-sm bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Sign Up</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="first-name" className="text-white">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name" className="text-white">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Robinson"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                Create an account
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleLogin}
                  onError={() =>
                    toast({
                      title: "Error",
                      description: "Failed to login with Google",
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-300">
              Already have an account?{" "}
              <Link href="/signin" className="underline text-purple-400 hover:text-purple-300 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}