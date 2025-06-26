"use client";
import ProfileForm, { ProfileFormValues } from "./profile-form";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { googleLogout } from "@react-oauth/google";
import { getSessionToken } from "@/lib/utils";
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/profile`, {
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
    <div >
      < Suspense fallback={< div > Loading...</div >}>
        <div className="space-y-6">
          <ProfileForm name={user?.name} initialValues={data} />
          <Button
            onClick={() => {
              googleLogout();
              localStorage.removeItem("loginData");
              setUser(null);
              push("/signup");
            }}
          >
            Logout
          </Button>
        </div>
      </Suspense >
    </div >
  );
};
export default Profile;
