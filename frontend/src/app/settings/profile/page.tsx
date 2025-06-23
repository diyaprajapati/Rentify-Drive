"use client";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import ProfileForm, { ProfileFormValues } from "./profile-form";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { title } from "process";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { googleLogout } from "@react-oauth/google";
import { getSessionToken } from "@/lib/utils";
import { SubscriptIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { push } = useRouter();
  const defaultValues: Partial<ProfileFormValues> = {
    mobileNumber: "",
    address: "",
  };
  const [data, setData] = useState<Partial<ProfileFormValues>>(defaultValues);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const sessionToken = await getSessionToken();
    try {
      const res = await axios.get("http://localhost:3001/users/profile", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });
      //@ts-ignore
      const { data } = res;
      const { user } = data;
      setUser(user);
      console.log(user);
      setData({
        mobileNumber: user.mobileNumber,
        address: user.address,
        file: user.drivingLicensePhoto,
      });
      console.log(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
              Manage your account settings and set e-mail preferences and more.
            </p>
          </div>
          <Separator />
          <ProfileForm name={user?.name} initialValues={data} />
          <Button
            onClick={() => {
              googleLogout();
              push("/signup");
            }}
          >
            Logout
          </Button>
        </div>
      </Suspense>
    </>
  );
};
export default Profile;
