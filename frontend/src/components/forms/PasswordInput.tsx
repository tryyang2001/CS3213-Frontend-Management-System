import { Input } from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";
import Eye from "../auth/EyeToggle";

interface InputProps {
  label: string;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  setIsInvalid?: Dispatch<SetStateAction<boolean>>;
}

export default function PasswordInput({
  label,
  password,
  setPassword,
  setIsInvalid,
}: InputProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isInvalidPassword, setInvalidPassword] = useState<boolean>(false);
  const handleValueChange = (s: string) => {
    setPassword(s);
    if (setIsInvalid == undefined) return;

    const isInvalid = s.length != 0 && s.length < 8;
    setInvalidPassword(isInvalid);
    setIsInvalid(isInvalid);
  };

  return (
    <Input
      isRequired
      type={isVisible ? "text" : "password"}
      label={label}
      endContent={<Eye isVisible={isVisible} setIsVisible={setIsVisible} />}
      size="sm"
      value={password}
      onValueChange={handleValueChange}
      isInvalid={isInvalidPassword}
      errorMessage={
        isInvalidPassword && "Your password must be at least 8 characters long"
      }
    />
  );
}
