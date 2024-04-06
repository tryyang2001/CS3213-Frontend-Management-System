"use client";

import { UserInfo } from "../../components/common/ReadOnlyUserCard";
import userService from "@/helpers/user-service/api-wrapper";
import ProfileEditor from "../../components/forms/ProfileEditor";
import AccountEditor from "../../components/forms/AccountEditor";
import { useEffect, useState } from "react";
import LogoLoading from "@/components/common/LogoLoading";
import { useUserContext } from "@/contexts/user-context";
import { Popover } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

export default function Page() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    const fetchUserInfo = async () => {
      try {
        if (user === null) {
          toast.error("You must login to view user page");
          router.push("/");
        } else {
          const userInfo = await userService.getUserInfo(user.uid);
          console.log(userInfo);
          if (userInfo === null) {
            toast.error("Unable to get user data");
            router.push("/");
          } else {
            setUserInfo(userInfo);
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
      router.push("/login");
      return;
    }
  }, [router]);

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

      {errorMessage && (
        <Popover
          color="danger"
          isOpen={errorMessage !== ""}
          onOpenChange={() => setErrorMessage("")}
        >
          {[<div key="error-message">{errorMessage}</div>]}
        </Popover>
      )}
    </div>
  );
}
