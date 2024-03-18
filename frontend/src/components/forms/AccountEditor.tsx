"use client";

import { useMemo, useState } from "react";
import { UserInfo } from "../common/ReadOnlyUserCard";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";

export default function AccountEditor({ userInfo }: { userInfo: UserInfo }) {
  const [newPassword, setNewPassword] = useState<string>("");
  const isInvalidPassword = useMemo(() => {
    if (newPassword == "") return false;
    return newPassword.length < 8;
  }, [newPassword]);

  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const isInvalidConfirm = useMemo(() => {
    if (newPassword == "" || passwordConfirm == "") return false;
    return newPassword != passwordConfirm;
  }, [newPassword, passwordConfirm]);

  const [accountMessage, setAccountMessage] = useState<string>("");
  const handleAccountSubmit = () => {
    void (async () => {
      if (newPassword == "" || passwordConfirm == "") {
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
        setAccountMessage("Profile saved!");
      }
    });
  };
  return (
    <form className="flex w-1/2 flex-col gap-4">
      <Input
        type="email"
        isDisabled
        isRequired
        label="Email"
        value={userInfo.email}
      />
      <Input
        type="password"
        label="New Password"
        name="New password"
        value={newPassword}
        onValueChange={setNewPassword}
        isRequired
        isInvalid={isInvalidPassword}
        errorMessage={isInvalidPassword && "Please enter at least 8 characters"}
      />
      <Input
        type="password"
        label="Confirm Password"
        isRequired
        name="Confirm new password"
        value={passwordConfirm}
        onValueChange={setPasswordConfirm}
        isInvalid={isInvalidConfirm}
        errorMessage={
          isInvalidConfirm &&
          "Your password confirmation does not match your new password"
        }
      />
      <Popover
        color="danger"
        isOpen={accountMessage != ""}
        onOpenChange={() => setAccountMessage("")}
      >
        <PopoverTrigger>
          <Button color="danger" onClick={handleAccountSubmit}>
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
