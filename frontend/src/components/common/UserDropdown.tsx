"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function UserDropdown({ children }: { children: ReactNode }) {
  const router = useRouter();

  const redirectToUserProfile = () => {
    router.push("/user");
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="hover:cursor-pointer">{children}</div>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="profile" onClick={redirectToUserProfile}>
          User Profile
        </DropdownItem>
        <DropdownItem key="logout" className="text-danger" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
