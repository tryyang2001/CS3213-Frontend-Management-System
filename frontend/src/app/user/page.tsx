import { Button, Textarea } from "@nextui-org/react";
import { ReadOnlyFullUserCard, UserInfo } from "./ReadOnlyUserCard";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileEditor from "./ProfileEditor";
import AccountEditor from "./AccountEditor";

export const getUserData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
    const userInfo: UserInfo = await res.json();
    return userInfo
};



export default async function Home() {
    const userInfo = await getUserData();

    return (
      <div className="flex flex-col items-center p-12">
        <ProfileEditor userInfo={userInfo} />
        <AccountEditor userInfo={userInfo} />
      </div>
    );
  }