"use client";

import { useEffect, useMemo, useState } from "react";
import { UserInfo } from "../common/ReadOnlyUserCard";
import {
  Button,
  Card,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import FileInput from "./FileInput";

export default function ProfileEditor({ userInfo }: { userInfo: UserInfo }) {
  const [info, setInfo] = useState<UserInfo>(userInfo);
  const [name, setName] = useState<string>(info.name);
  const isInvalidName = useMemo(() => {
    return name == "";
  }, [name]);
  const [bio, setBio] = useState<string>(info.bio);
  const [photo, setPhoto] = useState<string | undefined>(info.photo);
  const [newPhoto, setNewPhoto] = useState<File>();

  // userInfo is constant, do not change for now
  const hasChanged = useMemo(() => {
    if (name != info.name) return true;
    if (bio != info.bio) return true;
    if (photo != info.photo && !(photo == "" && info.photo == undefined))
      return true;
    return false;
  }, [name, bio, photo, info]);

  useEffect(() => {
    if (newPhoto) {
      setPhoto(URL.createObjectURL(newPhoto));
    } else {
      setNewPhoto(undefined);
      setPhoto(info.photo);
    }
  }, [newPhoto, info.photo]);

  const handleDiscard = () => {
    setName(info.name);
    setBio(info.bio);
    setPhoto(info.photo);
    setNewPhoto(undefined);
  };

  const [message, setMessage] = useState<string>("");
  const handleProfileSubmit = async () => {
    if (isInvalidName) {
      setMessage("Please fill in a name!");
      return;
    }

    if (name == info.name && bio == info.bio && photo == info.photo) {
      setMessage("Profile saved!");
      return;
    }

    const res = await fetch("https://jsonplaceholder.typicode.com/users/1", {
      method: "PATCH",
      body: JSON.stringify({
        name: name,
        bio: bio,
        photo: newPhoto,
        email: info.email,
      }),
    }).catch((err) => {
      console.log(err);
      return {
        status: 500,
        ok: false,
      };
    });

    if (!res.ok) {
      setMessage("An error occured, please try again later");
    } else {
      setMessage("Profile saved!");
      setInfo({
        email: info.email,
        name: name,
        bio: bio,
        photo: photo,
      });
    }
  };
  return (
    <form className="flex w-1/2 flex-col gap-4">
      <Card
        isFooterBlurred
        className="
                    border-none
                    self-center
                    max-w-[200px] max-h-[200px]"
        radius="lg"
      >
        <Avatar
          alt="Profile Picture"
          className="object-cover h-200 w-200"
          src={photo ? photo : "https://picsum.photos/200"}
          name={info.name}
          fallback
        />
        <CardFooter
          className="justify-end before:bg-white/10   
                        overflow-hidden py-1 absolute rounded-large bottom-1 ml-1 z-10"
        >
          <FileInput onFileChange={setNewPhoto} />
        </CardFooter>
      </Card>
      <Input
        type="text"
        isRequired
        name="Name"
        label="Name"
        value={name}
        onValueChange={setName}
        isInvalid={isInvalidName}
        errorMessage={isInvalidName && "Your name cannot be empty"}
      />
      <Textarea
        label="Bio"
        id="Bio"
        value={bio}
        onValueChange={setBio}
        placeholder="Share any you like..."
      />
      {hasChanged ? (
        <Button onClick={handleDiscard}> Discard Changes </Button>
      ) : (
        ""
      )}
      <Popover
        color="danger"
        isOpen={message != ""}
        onOpenChange={() => setMessage("")}
      >
        <PopoverTrigger>
          <Button color="danger" onClick={() => void handleProfileSubmit()}>
            {" "}
            Save Changes{" "}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="text-small" color="danger">
            {message}
          </p>
        </PopoverContent>
      </Popover>
    </form>
  );
}
