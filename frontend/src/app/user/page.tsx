import { ReadOnlyFullUserCard, UserInfo } from "../../components/common/ReadOnlyUserCard";
import ProfileEditor from "../../components/forms/ProfileEditor";
import AccountEditor from "../../components/forms/AccountEditor";

export default async function Home() {
    const userInfo = await getUserData();

    return (
      <div className="flex flex-col items-center p-12">
        <div className="flex w-full justify-around gap-12 pt-10">
            <div> Your Account </div>
          <ProfileEditor userInfo={userInfo} />
        </div>
        <div className="flex w-full justify-around gap-12 pt-10">
            <div> Your Profile </div>
            <AccountEditor userInfo={userInfo} />
        </div>
      </div>
    );
  }

export const getUserData = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const userInfo: UserInfo = await res.json();
  return userInfo
};