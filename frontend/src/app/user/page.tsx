"use client";
import userService from "@/helpers/user-service/api-wrapper";
import ProfileEditor from "../../components/forms/ProfileEditor";
import AccountEditor from "../../components/forms/AccountEditor";
import LogoLoading from "@/components/common/LogoLoading";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { user } = useUserContext();

  const router = useRouter();

  const { toast } = useToast();

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["get-user-info", user.uid],
    queryFn: async () => {
      const userInfo = await userService.getUserInfo(user.uid);

      if (userInfo === null) {
        toast({
          title: "User not found",
          description: "Please login again",
          variant: "destructive",
        });

        router.push("/dashboard");
        return null;
      }

      return userInfo;
    },
  });

  return (
    <div className="flex flex-col items-center p-2">
      {isLoading ? (
        <LogoLoading />
      ) : (
        <div className="w-full">
          <div className="flex w-full justify-around gap-12 pt-10">
            <div> Your Account </div>
            <ProfileEditor userInfo={userInfo!} />
          </div>
          <div className="flex w-full justify-around gap-12 pt-10">
            <div> Your Profile </div>
            <AccountEditor userInfo={userInfo!} />
          </div>
        </div>
      )}
    </div>
  );
}
