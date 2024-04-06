"use client";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useState } from "react";
import userService from "@/helpers/user-service/api-wrapper";
import Link from "next/link";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";
import Cookies from "js-cookie";
import { useUserContext } from "@/contexts/user-context";
import Router from "next/router";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { setUserContext } = useUserContext();

  const handleSubmit = async () => {
    if (email == "" || password == "") {
      setErrorMessage("Please enter the required fields");
      return;
    }
    if (isInvalid) {
      setErrorMessage("Please correct the invalid fields");
      return;
    }
    // mock for backend
    try {
      const user = await userService.login(email, password);
      Cookies.set('user', JSON.stringify(user), {expires: 7});
      setUserContext(user);
      await Router.push('/user/page');
    } catch (err) {
      if (err instanceof Error) {
        const errorMsg = err.message;
        setErrorMessage(errorMsg);
      } else {
        setErrorMessage("We are currently encountering some issues, please try again later");
      }
      await Router.push("/dashboard");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-wrap md:max-w-md max-w-xs justify-center gap-4">
        <EmailInput
          email={email}
          setEmail={setEmail}
          setIsInvalid={setIsInvalid}
        />
        <PasswordInput password={password} setPassword={setPassword} />

        <Popover
          color="danger"
          isOpen={errorMessage != ""}
          onOpenChange={() => setErrorMessage("")}
        >
          <PopoverTrigger>
            <Button
              type="submit"
              color="primary"
              className="w-full"
              onClick={() => void handleSubmit()}
            >
              {" "}
              Login{" "}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="text-tiny">{errorMessage}</div>
          </PopoverContent>
        </Popover>

        <div className="flex gap-3">
          <div>
            {" "}
            <Link href="/login/recovery"> Forgot Password </Link>{" "}
          </div>
          <div> | </div>
          <div>
            {" "}
            <Link href="/sign-up"> Sign up</Link>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
