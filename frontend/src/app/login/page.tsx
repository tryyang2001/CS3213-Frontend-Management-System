"use client";

import { Button, Divider } from "@nextui-org/react";
import { useState } from "react";
import userService from "@/helpers/user-service/api-wrapper";
import Link from "next/link";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";
import "react-toastify/dist/ReactToastify.css";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const { toast } = useToast();
  const { setUserContext } = useUserContext();

  const router = useRouter();

  const handleSubmit = async () => {
    if (email == "" || password == "" || isInvalid) {
      toast({
        title: "Invalid input",
        description: "Please check your input and try again",
        variant: "destructive",
      });
    }

    try {
      const user = await userService.login(email, password);
      if (!user) {
        throw new Error("Cannot logging in");
      }
      setUserContext(user);
      toast({
        title: "Login successfully",
        description: "Welcome back to ITS",
        variant: "success",
      });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        const errorMsg = err.message;
        toast({
          title: "Logging in unsucessfully",
          description: errorMsg,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logging in unsucessfully",
          description:
            "We are currently encountering some issues, please try again later",
          variant: "destructive",
        });
      }
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

        <PasswordInput
          label="Password"
          password={password}
          setPassword={setPassword}
        />

        <Button
          type="submit"
          onClick={() => {
            void (async () => {
              await handleSubmit();
            })();
          }}
          color="primary"
          className="w-full"
        >
          Login
        </Button>

        <div className="flex gap-3 text-center">
          <div>
            <Link href="/login/recovery">Forgot Password</Link>{" "}
          </div>

          <Divider orientation="vertical" />
          <div>
            <Link href="/sign-up">Sign up</Link>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-misused-promises */
