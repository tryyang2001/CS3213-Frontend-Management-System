"use client";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";

export default function Home() {
  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

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
    const res = await fetch("https://jsonplaceholder.typicode.com/session", {
      method: "Post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).catch((err: Error) => {
      console.log(err);
      return {
        ok: false,
        status: 500,
      };
    });

    if (res.status == 401) {
      setErrorMessage("Invalid Email/Password");
    } else if (!res.ok) {
      setErrorMessage(
        "We are currently encountering some issues, please try again later"
      );
    } else {
      router.push("/dashboard");
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
