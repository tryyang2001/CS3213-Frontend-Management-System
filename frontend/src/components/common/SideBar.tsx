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
    label: "Assignments",
    icon: <Icons.Dashboard className="text-2xl" />,
    link: "/dashboard",
  },
  {
    id: 2,
    label: "Create Assignment",
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
  const { user } = useUserContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (user === null) {
          router.push("/login");
        } else {
          const retrievedUserInfo = await userService.getUserInfo(user.uid);
          if (retrievedUserInfo !== null) {
            setUserInfo(retrievedUserInfo);
          }
        }
      } catch (_error) {}
    };

    if (user) {
      fetchUserInfo().catch((_err) => {
        return;
      });
    }
    // router does not change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // obtain current path, if is login/sign up, don't render SideBar
  const currentPath = usePathname();

  if (currentPath === "/login" || currentPath === "/sign-up") {
    return <></>;
  }

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
    >
      <div className="flex flex-col relative h-full">
        <div className="flex h-full pl-1 gap-4">
          {isCollapsed ? (
            <div className="flex flex-col h-full">
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

              <div className="flex-1 flex flex-col justify-center items-center">
                <Spacer y={1.5} />
                {menuItems.map((item: MenuItem) => {
                  if (
                    item.id === 2 &&
                    (user?.role ?? "student") === "student"
                  ) {
                    return <div key={item.id}></div>;
                  }

                  return (
                    <Button
                      isIconOnly
                      key={item.id}
                      className="flex text-black text-left items-center h-10"
                      onPress={() => handleNavigate(item.link)}
                    >
                      {item.icon}
                    </Button>
                  );
                })}
              </div>

              <Spacer y={20} />
            </div>
          ) : (
            <div className="flex flex-col h-full w-full items-start">
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

              <div className="flex-1 flex flex-col justify-center items-center">
                {menuItems.map((item: MenuItem) => {
                  if (
                    item.id === 2 &&
                    (user?.role ?? "student") === "student"
                  ) {
                    return <div key={item.id}></div>;
                  }

                  return (
                    <Button
                      key={item.id}
                      className="flex text-black text-left justify-start h-10 pl-2"
                      fullWidth={true}
                      startContent={item.icon}
                      onPress={() => handleNavigate(item.link)}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </div>
              <Spacer y={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
