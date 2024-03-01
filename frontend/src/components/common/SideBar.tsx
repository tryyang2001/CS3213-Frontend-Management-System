"use client";

import { useState } from "react";
import { Avatar, Button, User } from "@nextui-org/react";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { HiOutlineChevronDoubleLeft, HiMenu } from "react-icons/hi";
import classNames from "classnames";

const SideBar = () => {
  const userName = "Jane Doe";
  const userEmail = "janedoe@u.nus.edu";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-gray-200 text-black flex justify-between flex-col border border-dashed",
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
      </div>
    </div>
  );
};

export default SideBar;
