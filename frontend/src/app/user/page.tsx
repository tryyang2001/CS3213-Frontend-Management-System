"use client";
import userService from "@/helpers/user-service/api-wrapper";
import ProfileEditor from "../../components/forms/ProfileEditor";
import AccountEditor from "../../components/forms/AccountEditor";
import { useEffect, useState } from "react";
import LogoLoading from "@/components/common/LogoLoading";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function Page() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { user } = useUserContext();

  const router = useRouter();

  const { toast } = useToast();

  const fetchUserInfo = async () => {
    try {
      const userInfo = await userService.getUserInfo(user.uid);

      if (userInfo === null) {
        toast({
          title: "User not found",
          description: "Please login again",
          variant: "destructive",
        });

        router.push("/dashboard");
      } else {
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast({
        title: "Error fetching user info",
        description: "Please try again later",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="flex flex-col items-center p-2">
      {isLoading ? (
        <LogoLoading />
      ) : (
        <div className="w-full">
          <div className="flex w-full justify-around gap-12 pt-10">
            <div> Your Account </div>
            <ProfileEditor userInfo={userInfo} />
          </div>
          <div className="flex w-full justify-around gap-12 pt-10">
            <div> Your Profile </div>
            <AccountEditor userInfo={userInfo} />
          </div>
        </div>
      )}
    </div>
  );
}
