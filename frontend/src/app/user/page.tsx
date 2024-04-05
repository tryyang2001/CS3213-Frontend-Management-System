"use client";

import { UserInfo } from "../../components/common/ReadOnlyUserCard";
import userService from "@/helpers/user-service/api-wrapper";
import ProfileEditor from "../../components/forms/ProfileEditor";
import AccountEditor from "../../components/forms/AccountEditor";
import { useEffect, useState } from "react";
import LogoLoading from "@/components/common/LogoLoading";
import { UseUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { Popover } from "@nextui-org/react";

export default function Page() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { user } = UseUserContext();
  const router = useRouter();

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      if (user === null) {
        setErrorMessage("You must login to view user page");
        router.push("/dashboard");
      } else {
        const res = await userService.getUserInfo(user.uid);
        if (res === null) {
          setErrorMessage("Unable to get user data");
          router.push("/dashboard");
        } else {
          setUserInfo(res);
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setErrorMessage("An unexpected error occurred");
      // Handle the error based on its type
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo().catch((err) => console.log(err));
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
