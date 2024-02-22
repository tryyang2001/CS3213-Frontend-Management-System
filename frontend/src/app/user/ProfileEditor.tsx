"use client";

import { useEffect, useMemo, useState } from "react";
import { UserInfo } from "./ReadOnlyUserCard";
import { Image, Button, Card, CardHeader, Input, Popover, PopoverContent, PopoverTrigger, Textarea, CardFooter } from "@nextui-org/react";
import FileInput from "./FileInput";

export default function ProfileEditor({userInfo} : {userInfo: UserInfo}) {
    const [name, setName] = useState<string>(userInfo.name);
    const isInvalidName = useMemo(() => {
        return name == "";
    }, [name]);
    const [bio, setBio] = useState<string | undefined>(userInfo.bio);
    const [photo, setPhoto] = useState<string | undefined>(userInfo.photo);
    const [newPhoto, setNewPhoto] = useState<File>();
    
    const hasChanged = useMemo(() => {
        if (name != userInfo.name) return true;
        if (bio != userInfo.bio && !(bio == "" && userInfo.bio == undefined)) return true;
        if (photo != userInfo.photo && !(photo == "" && userInfo.photo == undefined)) return true;
        return false;
    }, [name, bio, photo])
    
    useEffect(() => {
        if (newPhoto) {
            setPhoto(URL.createObjectURL(newPhoto))
            console.log("Recieved file!");
        } else {
            setNewPhoto(undefined);
            setPhoto(userInfo.photo);
        }
    }, [newPhoto, userInfo.photo])
    
    const handleDiscard = () => {
        setName(userInfo.name);
        setBio(userInfo.bio || "");
        setPhoto(userInfo.photo);
        setNewPhoto(undefined);
    }

    const [profileMessage, setProfileMessage] = useState<string>("");
    const handleProfileSubmit = async () => {
        if (name == userInfo.name && bio == userInfo.bio && photo == userInfo.photo) {
            setProfileMessage("Profile saved!");
            return;
        }

        const res = await fetch("https://jsonplaceholder.typicode.com/users/1", {
            method: "PATCH",
            body: JSON.stringify({
                name: name,
                bio: bio,
                photo: newPhoto,
                email: userInfo.email
            })
        }).catch((err) => {
            console.log(err);
            return {
                status: 500,
                ok: false
            }
        })

        if (!res.ok) {
            setProfileMessage("An error occured, please try again later");
        } else {
            setProfileMessage("Profile saved!");
        }
    }
    return <div className="flex w-full justify-around gap-12">
            <div> Your Profile </div>
            <form className="flex w-1/2 flex-col gap-4">
                <Card isFooterBlurred className="
                    border-none
                    self-center
                    max-w-[200px] max-h-[200px]"
                    radius="lg">
                    <Image
                        removeWrapper
                        alt="Profile Picture"
                        className="object-cover"
                        src={photo ? photo : "https://picsum.photos/200"}
                        height={200}
                        width={200}
                        //place holder not permanent
                        fallbackSrc="https://picsum.photos/200"
                    />
                    <CardFooter className="justify-end before:bg-white/10   
                        overflow-hidden py-1 absolute rounded-large bottom-1 ml-1 z-10">
                        <FileInput onFileChange={setNewPhoto}/>
                    </CardFooter>
                </Card>
                <Input type="text" isRequired name="Name" 
                    label="Name" value={name} onValueChange={setName} 
                    isInvalid={isInvalidName} errorMessage={isInvalidName && "Your name cannot be empty"}/>
                <Textarea label="Bio" id="Bio" 
                    value={bio} onValueChange={setBio} placeholder="Share any you like..."/>
                {hasChanged ? <Button onClick={handleDiscard}> Discard Changes </Button> : ""}
                <Popover color="danger" isOpen={profileMessage !="" } onOpenChange={() => setProfileMessage("")}>
                    <PopoverTrigger>
                        <Button color="danger" onClick={handleProfileSubmit}> Save Changes </Button>
                    </PopoverTrigger>
                    <PopoverContent >
                        <p className="text-small" color="danger">{profileMessage}</p>
                    </PopoverContent>
                </Popover>
            </form>
        </div>
}