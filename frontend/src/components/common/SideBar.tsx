"use client";

import { useState, useEffect } from "react";
import { Avatar, Button, User, Spacer } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import Icons from "./Icons";
import UserDropdown from "./UserDropdown";
import { useUserContext } from "@/contexts/user-context";
import userService from "@/helpers/user-service/api-wrapper";

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
  }
]

export default function SideBar() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-lightgrey text-black flex flex-col",
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (user === null) {
          router.push('/login');
        } else {
          const retrievedUserInfo = await userService.getUserInfo(user.uid);
          if (retrievedUserInfo !== null) {
            setUserInfo(retrievedUserInfo);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchUserInfo().catch((err) => console.log(err));
    } else {
      console.log("no user context");
    }
  }, [user]);

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
                  name={userInfo.name}
                  description={userInfo.email}
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