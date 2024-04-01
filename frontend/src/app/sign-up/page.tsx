"use client";
import { useState, useMemo } from "react";
import { EyeSlashFilledIcon } from "@/components/common/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/common/EyeFilledIcon";
import {
  Button,
  Input,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const isInvalidEmail = useMemo<boolean>(() => {
    if (email === "") return false;
    return email.match(
      /^.+@([A-Z0-9.-]+\.[A-Z]{2,4})|(\[[0-9.]+\])|(\[IPv6[A-Z0-9:]+)$/i
    )
      ? false
      : true;
  }, [email]);

  const [password, setPassword] = useState<string>("");
  const isInvalidPassword = useMemo<boolean>(() => {
    if (password == "") return false;
    return password.length < 8;
  }, [password]);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [confirmation, setPasswordConfirmation] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isInvalidConfirmation = useMemo<boolean>(() => {
    if (confirmation == "" || password == "") return false;
    return confirmation != password;
  }, [confirmation, password]);

  const router = useRouter();

  const handleSubmit = async () => {
    if (email == "" || password == "" || confirmation == "") {
      setErrorMessage("Please enter the required fields");
      return;
    }

    if (isInvalidEmail || isInvalidConfirmation || isInvalidPassword) {
      setErrorMessage("Please correct the invalid fields");
      return;
    }

    // mock for backend
    const res = await fetch("https://jsonplaceholder.typicode.com/user", {
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

    if (!res.ok) {
      setErrorMessage(
        "We are currently encountering some issues, please try again later"
      );
    } else {
      router.push("/dashboard");
    }
  };

  function Eye() {
    return (
      <button
        className="focus:outline-none"
        type="button"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
      </button>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="flex flex-wrap md:max-w-md max-w-xs justify-center gap-4">
        <Input
          isRequired
          type="email"
          label="Email"
          placeholder="Enter your email"
          size="sm"
          value={email}
          onValueChange={setEmail}
          isInvalid={isInvalidEmail}
          errorMessage={isInvalidEmail && "Please enter a valid email"}
        />
        <Input
          isRequired
          type={isVisible ? "text" : "password"}
          label="Password"
          endContent={<Eye />}
          size="sm"
          value={password}
          onValueChange={setPassword}
          isInvalid={isInvalidPassword}
          errorMessage={
            isInvalidPassword &&
            "Your password must be at least 8 characters long"
          }
        />
        <Input
          isRequired
          type="password"
          label="Confirm Password"
          size="sm"
          value={confirmation}
          onValueChange={setPasswordConfirmation}
          isInvalid={isInvalidConfirmation}
          errorMessage={
            isInvalidConfirmation &&
            "Your password confirmation does not match your password"
          }
        />

        <Popover
          color="danger"
          isOpen={errorMessage != ""}
          onOpenChange={() => setErrorMessage("")}
        >
          <PopoverTrigger>
            <Button
              type="submit"
              size="sm"
              color="primary"
              className="w-full"
              onClick={() => void handleSubmit()}
            >
              {" "}
              Sign Up
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="text-tiny">{errorMessage}</div>
          </PopoverContent>
        </Popover>

        <div className="flex gap-3">
          <div className="text-sm">
            {" "}
            Have an account? Login <Link href="/login"> here</Link>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
