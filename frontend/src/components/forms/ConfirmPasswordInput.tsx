import { Input } from "@nextui-org/react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

interface InputProps {
  password: string;
  setIsInvalid: Dispatch<SetStateAction<boolean>>;
}

export default function ConfirmPasswordInput({
  password,
  setIsInvalid,
}: InputProps) {
  const [confirmation, setConfirmation] = useState<string>("");
  const isInvalidConfirm = useMemo<boolean>(() => {
    const isInvalid = confirmation != password;
    return isInvalid;
  }, [password, confirmation]);

  useEffect(() => {
    setIsInvalid(isInvalidConfirm);
  }, [isInvalidConfirm, setIsInvalid]);

  return (
    <Input
      type="password"
      label="Confirm Password"
      isRequired
      name="Confirm new password"
      value={confirmation}
      onValueChange={setConfirmation}
      isInvalid={isInvalidConfirm}
      errorMessage={
        isInvalidConfirm &&
        "Your password confirmation does not match your new password"
      }
    />
  );
}
