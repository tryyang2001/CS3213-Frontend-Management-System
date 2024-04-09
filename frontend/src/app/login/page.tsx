"use client";

import { Button, Divider } from "@nextui-org/react";
import { useState } from "react";
import userService from "@/helpers/user-service/api-wrapper";
import Link from "next/link";
import EmailInput from "@/components/forms/EmailInput";
import PasswordInput from "@/components/forms/PasswordInput";
import Cookies from "js-cookie";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const { setUser } = useUserContext();

  const router = useRouter();

  const { toast } = useToast();

  const handleSubmit = async () => {
    if (email === "" || password === "" || isInvalid) {
      return toast({
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

      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      setUser(user);

      toast({
        title: "Login successfully",
        description: "Welcome back to ITS, " + user.name,
        variant: "success",
      });

      router.push("/dashboard");
    } catch (_err) {
      toast({
        title: "Login failed",
        description:
          "We are currently encountering some issues, please try again later",
        variant: "destructive",
      });
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

        <Button
          type="submit"
          onClick={handleSubmit}
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
