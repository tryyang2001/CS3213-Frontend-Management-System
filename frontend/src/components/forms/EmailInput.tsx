"use client";

import { Input } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";

interface InputProps {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setIsInvalid?: Dispatch<SetStateAction<boolean>>;
}

export const invalidMessage = "Please enter a valid email";

export default function EmailInput({
  email,
  setEmail,
  setIsInvalid,
}: InputProps) {
  const [isInvalidEmail, setInvalidEmail] = useState<boolean>(false);

  const handleValueChange = (s: string) => {
    setEmail(s);
    if (setIsInvalid == undefined) return;
    const isInvalid =
      s != "" &&
      (s.match(
        /^.+@([A-Z0-9.-]+\.[A-Z]{2,4})|(\[[0-9.]+\])|(\[IPv6[A-Z0-9:]+)$/i
      )
        ? false
        : true);
    setIsInvalid(isInvalid);
    setInvalidEmail(isInvalid);
  };

  return (
    <Input
      isRequired
      type="email"
      label="Email"
      placeholder="Enter your email"
      value={email}
      onValueChange={handleValueChange}
      color={isInvalidEmail ? "danger" : "default"}
      isInvalid={isInvalidEmail}
      errorMessage={isInvalidEmail && invalidMessage}
    />
  );
}
