"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import PasswordInput from "./PasswordInput";
import ConfirmPasswordInput from "./ConfirmPasswordInput";
import userService from "@/helpers/user-service/api-wrapper";

export default function AccountEditor({
  uid,
  userInfo,
}: {
  uid: number;
  userInfo: UserInfo;
}) {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);
  const [isInvalidConfirm, setIsInvalidConfirm] = useState<boolean>(false);
  const [accountMessage, setAccountMessage] = useState<string>("");
  const [updateCount, setUpdateCount] = useState<number>(2);

  const handleAccountSubmit = async () => {
    if (newPassword == "" || oldPassword == "") {
      setAccountMessage("Please fill in the required fields");
      return;
    }
    if (isInvalidConfirm || isInvalidPassword) {
      setAccountMessage("Please correct the invalid fields");
      return;
    }

    try {
      await userService.updateUserPassword(uid, oldPassword, newPassword);
      setUpdateCount(updateCount + 1);
      setAccountMessage("Update password successfully");
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        setAccountMessage(errorMessage);
      } else {
        setAccountMessage("Unknown error updating password, please try again");
      }
    } finally {
      setNewPassword("");
      setOldPassword("");
    }
  };

  return (
    <form className="flex w-1/2 flex-col gap-4" key={updateCount}>
      <Input type="email" isDisabled label="Email" value={userInfo.email} />
      <PasswordInput
        label="Old Password"
        password={oldPassword}
        setPassword={setOldPassword}
        setIsInvalid={setIsInvalidPassword}
      />
      <PasswordInput
        label="New Password"
        password={newPassword}
        setPassword={setNewPassword}
        setIsInvalid={setIsInvalidPassword}
      />
      <ConfirmPasswordInput
        password={newPassword}
        setIsInvalid={setIsInvalidConfirm}
      />

      <Popover
        color="primary"
        isOpen={accountMessage != ""}
        onOpenChange={() => setAccountMessage("")}
      >
        <PopoverTrigger>
          <Button color="primary" onClick={() => void handleAccountSubmit()}>
            {" "}
            Update Password{" "}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-small" color="primary">
            {accountMessage}
          </p>
        </PopoverContent>
      </Popover>
    </form>
  );
}
