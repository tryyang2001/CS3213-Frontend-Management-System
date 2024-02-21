"use client";

import {Button, Input} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Home() {
    const [email, setEmail] = useState<string>("");
    const isInvalidEmail = useMemo<boolean>(() => {
        if (email === "") return false;

        return email.match(/^.+@([A-Z0-9.-]+\.[A-Z]{2,4})|(\[[0-9.]+\])|(\[IPv6[A-Z0-9:]+)$/i) ? false : true;
    }, [email])

    const [password, setPassword] = useState<string>("");
    const [isInvalidPassword, setIsInvalidPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const router = useRouter();
    
    const handleSubmit = () => {
        if (isInvalidEmail) {
            return;
        }

        // mock for backend
        fetch("https://jsonplaceholder.typicode.com/session", {
            method: "Post",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then((res) => {
            if (res.status == 401) {
                setIsInvalidPassword(true)
                setErrorMessage("Invalid Credentials");
                throw new Error("Invalid Credentials");
            } else if (!res.ok) {
                setIsInvalidPassword(true)
                setErrorMessage("We are currently encountering some issues, please try again later");
                throw new Error("We are currently encountering some issues, please try again later");
            } else {
                setIsInvalidPassword(false);
                return res.json();
            }
        })
        .then((data) => {
            router.push("/dashboard")
        })
        .catch((err: Error) => console.log(err.message));

        setPassword("");
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
        <div className="flex flex-wrap md:max-w-md max-w-xs justify-center gap-7">  
            <Input isRequired type="email" label="Email" 
                placeholder="Enter your email" 
                value={email} onValueChange={setEmail} 
                color={isInvalidEmail ? "danger" : "default"}
                isInvalid={isInvalidEmail}
                errorMessage={isInvalidEmail && "Please enter a valid email"}
                />
            <Input isRequired type={isVisible ? "text" : "password"} 
                label="Password" endContent={<Eye />} 
                value={password} onValueChange={setPassword}
                errorMessage={isInvalidPassword && errorMessage} />
            <Button type="submit" color="primary" className="w-full" onClick={handleSubmit}> Login </Button>
            
            <div className="flex gap-3">
                <div> <Link href="/login/recovery"> Forgot Password </Link> </div>
                <div> | </div>
                <div> <Link href="/sign-up"> Sign up</Link> </div>
            </div>
        </div>
        
    </div>
}