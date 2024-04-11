"use client";

import userService from "@/helpers/user-service/api-wrapper";
import { useState, useMemo } from "react";
import { EyeSlashFilledIcon } from "@/components/auth/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/auth/EyeFilledIcon";
import { Button, Input, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

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
    return password.length < 10;
  }, [password]);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [confirmation, setPasswordConfirmation] = useState<string>("");

  const isInvalidConfirmation = useMemo<boolean>(() => {
    if (confirmation == "" || password == "") return false;
    return confirmation != password;
  }, [confirmation, password]);

  const router = useRouter();

  const { toast } = useToast();

  const handleSubmit = async () => {
    if (isInvalidEmail || isInvalidConfirmation || isInvalidPassword) {
      return toast({
        title: "Invalid input",
        description: "Please check your input and try again",
        variant: "destructive",
      });
    }

    try {
      await userService.register(email, password);

      toast({
        title: "Sign Up successfully",
        description:
          "Welcome to ITS, you may proceed to login with your registered email and password.",
        variant: "success",
      });

      // push to login page since we haven't set up the cookie yet
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        const errorMsg = error.message;
        toast({
          title: "Signing up unsucessfully",
          description: errorMsg,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signing up unsucessfully",
          description:
            "We are currently encountering some issues, please try again later",
          variant: "destructive",
        });
      }
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

        <Button
          type="submit"
          size="sm"
          color="primary"
          onClick={() => {
            void (async () => {
              await handleSubmit();
            })();
          }}
        >
          {" "}
          Sign Up
        </Button>

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
