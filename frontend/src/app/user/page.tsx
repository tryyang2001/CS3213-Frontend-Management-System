"use client";

import { UserInfo } from "../../components/common/ReadOnlyUserCard";
import ProfileEditor from "../../components/forms/ProfileEditor";
import AccountEditor from "../../components/forms/AccountEditor";
import { useEffect, useState } from "react";
import LogoLoading from "@/components/common/LogoLoading";

export default function Page() {
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUserData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const userInfo: UserInfo = await res.json() as UserInfo;

    setUserInfo(userInfo);
    setIsLoading(false);
  };

  useEffect(() => {
    getUserData().catch(err => console.log(err));
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
