"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/contexts/user-context";
import userService from "@/helpers/user-service/api-wrapper";

export default function UserDropdown({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const { setUserContext } = useUserContext();
  const redirectToUserProfile = () => {
    router.push("/user");
  };

  const handleLoggingOut = () => {
    localStorage.removeItem("userContext");

    setUserContext(null);

    userService
      .clearCookie()
      .then(() => {
        toast({
          title: "Log out succesfully",
          description: "You have been logged out successfully",
          variant: "success",
        });

        router.push("/login");
      })
      .catch((_err) => {
        toast({
          title: "Log out unsuccesfully",
          description:
            "We are currently encountering some issues, please try again later",
          variant: "destructive",
        });
      });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="hover:cursor-pointer">{children}</div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="profile" onClick={redirectToUserProfile}>
          User Profile
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          onClick={handleLoggingOut}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
