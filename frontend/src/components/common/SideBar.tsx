"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import classNames from "classnames";
import { Avatar, Button, User, Link } from "@nextui-org/react";
import { HiOutlineChevronDoubleLeft, HiMenu } from "react-icons/hi";
import { MdHome, MdAssignment, MdLogout } from "react-icons/md";

const SideBar = () => {
  const userName = "Jane Doe";
  const userEmail = "janedoe@u.nus.edu";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-gray-200 text-black flex justify-between flex-col",
    {
      ["w-60"]: !isCollapsed,
      ["w-20"]: isCollapsed,
    }
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-gray-300 absolute right-0",
    { "rotate-180": isCollapsed }
  );

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { id: 1, label: "Home", icon: MdHome, link: "/" },
    { id: 2, label: "Assignments", icon: MdAssignment, link: "/dashboard" },
  ];

  const currentPath = usePathname();

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === currentPath),
    [currentPath]
  );

  const getNavItemClasses = (menu: {
    id: any;
    label?: string;
    link?: string;
  }) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-light-lighter"]: activeMenu && activeMenu.id === menu.id,
      }
    );
  };

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col relative">
        <div className="flex items-center pl-1 gap-4">
          {isCollapsed ? (
            <div className="block">
              <Button
                isIconOnly
                onClick={handleToggleCollapse}
                className="text-black shadow-lg"
              >
                <HiMenu className="text-2xl" />
              </Button>
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
            </div>
          ) : (
            <User
              name={userName}
              description={userEmail}
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              }}
            />
          )}
        </div>
        {!isCollapsed && isCollapsible && (
          <Button
            isIconOnly
            onClick={handleToggleCollapse}
            className="text-black shadow-lg absolute right-0"
          >
            <HiOutlineChevronDoubleLeft className="text-2xl" />
          </Button>
        )}
        <div className="flex flex-col items-start mt-24">
          {menuItems.map(({ icon: Icon, ...menu }, index) => {
            const classes = getNavItemClasses(menu);
            return (
              <div className={classes} key={menu.id}>
                <Link href={menu.link}>
                  <div className="flex py-4 px-3 items-center w-full h-full">
                    <div style={{ width: "2.5rem" }}>
                      <Icon />
                    </div>
                    {!isCollapsed && (
                      <span
                        className={classNames(
                          "text-md font-medium text-text-light"
                        )}
                      >
                        {menu.label}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="absolute bottom-5 w-full flex items-center cursor-pointer hover:bg-light-lighter rounded overflow-hidden whitespace-nowrap" /* className={`${getNavItemClasses({})} px-3 py-4`}*/
      >
        <div style={{ width: "2.5rem" }}>
          <MdLogout />
        </div>
        {!isCollapsed && (
          <span className={classNames("text-md font-medium text-text-light")}>
            Logout
          </span>
        )}
      </div>
    </div>
  );
};

export default SideBar;
