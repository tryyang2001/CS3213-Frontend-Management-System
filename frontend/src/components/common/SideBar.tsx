"use client";

import { useState } from "react";
import { Avatar, Button, User, Spacer } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import Icons from "./Icons";
import UserDropdown from "./UserDropdown";

interface MenuItem {
  id: number;
  label: string;
  icon: JSX.Element;
  link: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    label: "View Assignments",
    icon: <Icons.ViewAssignment className="text-2xl" />,
    link: "/dashboard",
  },
  {
    id: 2,
    label: "Create New Assignment",
    icon: <Icons.CreateNewInstance className="text-2xl" />,
    link: "/assignments/create",
  },
  {
    id: 3,
    label: "View Submissions",
    icon: <Icons.ViewSubmissions className="text-2xl" />,
    link: "/assignments/submissions",
  },
];

export default function SideBar() {
  const router = useRouter();
  const userName = "Jane Doe";
  const userEmail = "janedoe@u.nus.edu";
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const wrapperClasses = classNames(
    "h-dvh px-4 pt-8 pb-4 bg-lightgrey text-black flex flex-col",
    {
      ["w-60"]: !isCollapsed,
      ["w-20"]: isCollapsed,
    }
  );

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  // obtain current path, if is login/sign up, don't render SideBar
  const currentPath = usePathname();

  if (currentPath === "/login" || currentPath === "/sign-up") {
    return null;
  }

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
    >
      <div className="flex flex-col relative">
        <div className="flex items-center pl-1 gap-4">
          {isCollapsed ? (
            <div className="block">
              <div className="mb-4">
                <Button
                  isIconOnly
                  onClick={handleToggleCollapse}
                  className="text-black"
                >
                  <Icons.Expand className="text-2xl" />
                </Button>
              </div>

              <UserDropdown>
                <Avatar
                  showFallback
                  name="Jane"
                  src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                />
              </UserDropdown>

              <Spacer y={60} />

              {menuItems.map((item: MenuItem) => (
                <Button
                  isIconOnly
                  key={item.id}
                  // onClick={handleToggleCollapse}
                  className="text-black"
                  onPress={() => handleNavigate(item.link)}
                >
                  {item.icon}
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full items-start">
              <div className="mb-4">
                <Button
                  isIconOnly
                  onClick={handleToggleCollapse}
                  className="text-black"
                >
                  <Icons.Collapse className="text-2xl" />
                </Button>
              </div>

              <UserDropdown>
                <User
                  name={userName}
                  description={userEmail}
                  avatarProps={{
                    src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                    alt: "Jane",
                    showFallback: true,
                  }}
                />
              </UserDropdown>

              <Spacer y={60} />
              {menuItems.map((item: MenuItem) => (
                <Button
                  // isIconOnly
                  // onClick={handleToggleCollapse}
                  key={item.id}
                  className="flex text-black text-left items-center justify-start p-2"
                  fullWidth={true}
                  startContent={item.icon}
                  onPress={() => handleNavigate(item.link)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
