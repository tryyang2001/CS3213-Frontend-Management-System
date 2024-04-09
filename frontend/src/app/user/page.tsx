"use client";
import userService from "@/helpers/user-service/api-wrapper";
import ProfileEditor from "../../components/forms/ProfileEditor";
import AccountEditor from "../../components/forms/AccountEditor";
import { useEffect, useState } from "react";
import LogoLoading from "@/components/common/LogoLoading";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import Cookies from "js-cookie";

export default function Page() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (user === null || Cookies.get('token')) {
          toast.error("You must login to view user page");
          router.push("/");
        } else {
          const retrievedUserInfo = await userService.getUserInfo(user.uid);
          console.log("retrieved", retrievedUserInfo);
          if (retrievedUserInfo === null) {
            toast.error("Unauthorized, please log in again");
            router.push("/login");
          } else {
            setUserInfo(retrievedUserInfo);
          }
        }
        setIsLoading(false);
      } catch (error) { 
        console.error("Error fetching user info:", error);
        toast.error("An unexpected error occurred");
        // Handle the error based on its type
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserInfo().catch((err) => console.log(err));
    } else {
      console.log("no user context");
      setIsLoading(false);
      router.push("/");
    }
  }, [user]);

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
