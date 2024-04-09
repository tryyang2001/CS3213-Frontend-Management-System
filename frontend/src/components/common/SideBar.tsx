"use client";

import { useState, useEffect } from "react";
import { Avatar, Button, User, Spacer } from "@nextui-org/react";
import { HiOutlineChevronDoubleLeft, HiMenu } from "react-icons/hi";
import { useRouter } from "next/navigation";
import {
  MdOutlineAssignment,
  MdOutlineUploadFile,
  MdOutlineLogout,
  MdOutlineLogin,
  MdHome
} from "react-icons/md";
import classNames from "classnames";
import { useUserContext } from "@/contexts/user-context";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
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
    icon: <MdOutlineAssignment className="text-2xl" />,
    link: "/dashboard",
  },
  {
    id: 2,
    label: "Submissions",
    icon: <MdOutlineUploadFile className="text-2xl" />,
    link: "/assignments/submissions",
  },
  {
    id: 3,
    label: "Dashboard",
    icon: <MdHome className="text-2xl" />,
    link: "/dashboard",
  },
];

export default function SideBar() {
  const router = useRouter();
  const { user, setUserContext } = useUserContext();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
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

  const handleLoggingOut = () => {
    localStorage.removeItem('userContext');
    setUserContext(null);
  }

  const handleLoggingIn = () => {
    handleNavigate('/login');
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (user === null || Cookies.get('token')) {
          toast.error("You must login to view user page");
        } else {
          const retrievedUserInfo = await userService.getUserInfo(user.uid);
          if (retrievedUserInfo !== null) {
            setUserInfo(retrievedUserInfo);
          }
        }
        setLoggedIn(true);
      } catch (error) { 
        setLoggedIn(false);
        console.error("Error fetching user info for sidebar:", error);
        toast.error("An unexpected error occurred");
      }
    };

    if (user) {
      fetchUserInfo().catch((err) => console.log(err));
    } else {
      console.log("no user context");
      setLoggedIn(false);
    }
  }, [user]);

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
              <Button
                isIconOnly
                onClick={handleToggleCollapse}
                className="text-black"
              >
                <HiMenu className="text-2xl" />
              </Button>
              { isLoggedIn ? 
                <Avatar
                  showFallback
                  name="Jane"
                  src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                />
              : <div></div>
              }
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
              <Spacer y={72} />
              <Spacer y={6} />
              { isLoggedIn
              ?
                <Button
                  isIconOnly
                  className="text-black"
                  onPress={() => handleLoggingOut()}
                >
                  <MdOutlineLogout className="text-2xl" />
                </Button>
              : <Button
                  isIconOnly
                  className="text-black"
                  onPress={() => handleLoggingIn()}
                >
                  <MdOutlineLogin className="text-2xl" />
                </Button>
              }
            </div>
          ) : (
            <div className="flex flex-col w-full items-start">
              <Button
                isIconOnly
                onClick={handleToggleCollapse}
                className="text-black"
              >
                <HiOutlineChevronDoubleLeft className="text-2xl" />
              </Button>
              {isLoggedIn ? <User
                name={userInfo.name}
                description={userInfo.email}
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                  alt: "Jane",
                  showFallback: true,
                }}
              /> : <div></div>}
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
              <Spacer y={72} />
              <Spacer y={6} />
              { isLoggedIn
              ?
                <Button
                  // isIconOnly
                  // onClick={handleToggleCollapse}
                  className="flex text-black w-full text-left items-center justify-start p-2"
                  fullWidth={true}
                  onPress={() => handleLoggingOut()}
                  startContent={<MdOutlineLogout className="text-2xl" />}
                >
                  Log Out
                </Button>
              : <Button
                  // isIconOnly
                  // onClick={handleToggleCollapse}
                  className="flex text-black w-full text-left items-center justify-start p-2"
                  fullWidth={true}
                  onPress={() => handleLoggingIn()}
                  startContent={<MdOutlineLogin className="text-2xl" />} 
                >
                  Sign in
                </Button>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
