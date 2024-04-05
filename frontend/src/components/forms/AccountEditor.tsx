"use client";

import { useState } from "react";
import { UserInfo } from "../common/ReadOnlyUserCard";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import PasswordInput from "./PasswordInput";
import ConfirmPasswordInput from "./ConfirmPasswordInput";

export default function AccountEditor({ userInfo }: { userInfo: UserInfo }) {
  const [newPassword, setNewPassword] = useState<string>("");
  const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);
  const [isInvalidConfirm, setIsInvalidConfirm] = useState<boolean>(false);
  const [accountMessage, setAccountMessage] = useState<string>("");
  const [updateCount, setUpdateCount] = useState<number>(2);

  const handleAccountSubmit = async () => {
    if (newPassword == "") {
      setAccountMessage("Please fill in the required fields");
      return;
    }
    if (isInvalidConfirm || isInvalidPassword) {
      setAccountMessage("Please correct the invalid fields");
      return;
    }

    const res = await fetch("https://jsonplaceholder.typicode.com/users/1", {
      method: "PATCH",
      body: JSON.stringify({
        email: userInfo.email,
        password: newPassword,
      }),
    }).catch((err) => {
      console.log(err);
      return {
        status: 500,
        ok: false,
      };
    });

    if (!res.ok) {
      setAccountMessage("An error occured, please try again later");
    } else {
      setAccountMessage("Password Updated!");
      setNewPassword("");
      setUpdateCount(updateCount + 1);
    }
  };

  return (
    <form className="flex w-1/2 flex-col gap-4" key={updateCount}>
      <Input type="email" isDisabled label="Email" value={userInfo.email} />
      <PasswordInput
        password={newPassword}
        setPassword={setNewPassword}
        setIsInvalid={setIsInvalidPassword}
      />
      <ConfirmPasswordInput
        password={newPassword}
        setIsInvalid={setIsInvalidConfirm}
      />

      <Popover
        color="danger"
        isOpen={accountMessage != ""}
        onOpenChange={() => setAccountMessage("")}
      >
        <PopoverTrigger>
          <Button color="danger" onClick={() => void handleAccountSubmit()}>
            {" "}
            Update Password{" "}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-small" color="danger">
            {accountMessage}
          </p>
        </PopoverContent>
      </Popover>
    </form>
  );
}
