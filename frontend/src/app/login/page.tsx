"use client";

import {Button, Input, Popover, PopoverContent, PopoverTrigger} from "@nextui-org/react";
import Cookies from 'js-cookie';
import { useMemo, useState } from "react";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { USER_API_ENDPOINT } from "config";


export default function Home() {
    const [email, setEmail] = useState<string>("");
    const isInvalidEmail = useMemo<boolean>(() => {
        if (email === "") return false;

        return email.match(/^.+@([A-Z0-9.-]+\.[A-Z]{2,4})|(\[[0-9.]+\])|(\[IPv6[A-Z0-9:]+)$/i) ? false : true;
    }, [email])

    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const router = useRouter();
    
    const handleSubmit = async () => {
        if (email == "" || password == "") {
            setErrorMessage("Please enter the required fields");
            return;
        }
        if (isInvalidEmail) {
            setErrorMessage("Please correct the invalid fields");
            return;
        }

        // mock for backend
        const res = await fetch(USER_API_ENDPOINT + "/login", {
            method: "Post",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: 'include',
        }).catch((err: Error) => {
            console.log(err);
            return {
                ok: false,
                status: 500
            }
        });

        if (res.status == 401) {
            setErrorMessage("Invalid Email/Password");
        } else if (!res.ok) {
            setErrorMessage("We are currently encountering some issues, please try again later");
        } else {
            const responseData = await (res as Response).json();
            const user = responseData.user;
            console.log(user); // This will log the user object
            Cookies.set('user', JSON.stringify({user}), { expires: 7 })
            router.push("/dashboard");
        }

    }

    const Eye = () => {
        return <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? (
            <EyeSlashFilledIcon />
          ) : (
            <EyeFilledIcon />
          )}
        </button>
    }
    
    return <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex flex-wrap md:max-w-md max-w-xs justify-center gap-4">  
            <Input isRequired type="email" label="Email" 
                placeholder="Enter your email" 
                value={email} onValueChange={setEmail} 
                color={isInvalidEmail ? "danger" : "default"}
                isInvalid={isInvalidEmail}
                errorMessage={isInvalidEmail && "Please enter a valid email"}
                />
            
            <Input label="Password" isRequired 
                value={password} onValueChange={setPassword}
                type={isVisible ? "text" : "password"} endContent={<Eye />} />

            <Popover color="danger" isOpen={errorMessage != ""} onOpenChange={() => setErrorMessage("")}>
                <PopoverTrigger>
                    <Button type="submit" color="primary" className="w-full" onClick={handleSubmit}> Login </Button>
                </PopoverTrigger>
                <PopoverContent>
                        <div className="text-tiny">{errorMessage}</div>
                </PopoverContent>
            </Popover>
            
            <div className="flex gap-3">
                <div> <Link href="/login/recovery"> Forgot Password </Link> </div>
                <div> | </div>
                <div> <Link href="/sign-up"> Sign up</Link> </div>
            </div>
        </div>
    </div>
}