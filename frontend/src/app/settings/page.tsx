"use client"
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  useEffect(() => {
    redirect("/settings/profile")
  }, [])
  return (
    <>
    </>
  )
}
export default Profile;
