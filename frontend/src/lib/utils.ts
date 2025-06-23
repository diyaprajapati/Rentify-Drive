import { toast } from "@/hooks/use-toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getSessionToken() {
  const tokenString = localStorage.getItem("loginData");
  if (!tokenString) {
    return;
  }
  // use zod to parse the token

  const right = z
    .object({
      sessionToken: z.string(),
    })
    .parse(JSON.parse(tokenString));
  if (!right) {
    toast({
      title: "Error",
      description: "Invalid token",
    });
  }

  const { sessionToken } = JSON.parse(tokenString);
  return sessionToken;
}

export async function getRole() {
  const tokenString = localStorage.getItem("loginData");
  if (!tokenString) {
    return;
  }

  const right = z
    .object({
      role: z.string(),
    })
    .parse(JSON.parse(tokenString));
  if (!right) {
    toast({
      title: "Error",
      description: "Invalid User",
    });
  }
  const { role } = JSON.parse(tokenString);
  return role;
}

export const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] ?? "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
