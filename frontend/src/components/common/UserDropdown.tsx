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
import Cookies from "js-cookie";
import { useUserContext } from "@/contexts/user-context";

export default function UserDropdown({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const { setUserContext } = useUserContext();
  const redirectToUserProfile = () => {
    router.push("/user");
  };

  const handleLoggingOut = () => {
    localStorage.removeItem("userContext");
    Cookies.remove("token");
    setUserContext(null);
    toast({
      title: "Log out succesfully",
      description: "see you later!",
      variant: "success",
    });
    router.push("/login");
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
