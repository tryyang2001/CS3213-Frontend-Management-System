"use client";
import {useState, useMemo} from "react";
import { EyeSlashFilledIcon } from "../login/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../login/EyeFilledIcon";
import { Button, Input, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [email, setEmail] = useState<string>("");
    const isInvalidEmail = useMemo<boolean>(() => {
        if (email === "") return false;

        return email.match(/^.+@([A-Z0-9.-]+\.[A-Z]{2,4})|(\[[0-9.]+\])|(\[IPv6[A-Z0-9:]+)$/i) ? false : true;
    }, [email])

    const [password, setPassword] = useState<string>("");
    const isInvalidPassword = useMemo<boolean>(() => {
        if (password == "") return false;

        return password.length < 8
    }, [password]);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    
    const [confirmation, setPasswordConfirmation] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const isInvalidConfirmation = useMemo<boolean>(() => {
        if (confirmation == "" || password == "") return false;

        return confirmation != password
    }, [confirmation, password])
    
    const router = useRouter();

    const handleSubmit = () => {
        if (isInvalidEmail || isInvalidConfirmation || isInvalidPassword ||
            email == "" || password == "" || confirmation == "") {
            setErrorMessage("Please enter the required fields")
            return;
        }

        // mock for backend
        fetch("https://jsonplaceholder.typicode.com/user", {
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
            if (!res.ok) {
                setErrorMessage("We are currently encountering some issues, please try again later");
                throw new Error("We are currently encountering some issues, please try again later");
            } else {
                return res.json();
            }
        })
        .then((data) => {
            router.push("/profile")
        })
        .catch((err: Error) => console.log(err.message));
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

    const ErrorMessage = () => {
        return <p className="text-red-400 text-sm" >
                {errorMessage}
            </p>
    }
    
    return <div className="w-screen h-screen flex items-center justify-center">
        <div className="flex flex-wrap md:max-w-md max-w-xs justify-center gap-4">  
            <Input isRequired type="email" label="Email"
                placeholder="Enter your email" size="sm"
                value={email} onValueChange={setEmail}
                isInvalid={isInvalidEmail}
                errorMessage={isInvalidEmail && "Please enter a valid email"}
                />
            <Input isRequired type={isVisible ? "text" : "password"} 
                label="Password" endContent={<Eye />} size="sm"
                value={password} onValueChange={setPassword}
                isInvalid={isInvalidPassword}
                errorMessage={isInvalidPassword && "Your password must be at least 8 characters long"} />
            <Input isRequired type="password"
                label="Confirm Password" size="sm"
                value={confirmation} onValueChange={setPasswordConfirmation}
                isInvalid={isInvalidConfirmation}
                errorMessage={isInvalidConfirmation && "Your password confirmation does not match your password"} />
            <ErrorMessage />
            <Button type="submit" size= "sm" color="primary" className="w-full" onClick={handleSubmit}> Sign Up</Button>
            <div className="flex gap-3">
                <div className="text-sm"> Have an account? Login <Link href="/login">  here</Link> </div>
            </div>
        </div>
        
    </div>
}