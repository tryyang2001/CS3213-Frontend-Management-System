"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Image,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";

interface FileInputProps {
  onFileChange: Dispatch<SetStateAction<File | undefined>>;
}

export default function FileInput({ onFileChange }: FileInputProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string>("");
  const [file, setFile] = useState<File>();
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const upload = event.target.files?.[0];
    if (upload) {
      const fileURL = URL.createObjectURL(upload);
      setFile(upload);
      setPhoto(fileURL);
    } else {
      setPhoto("");
      setFile(undefined);
    }
  };
  const onOpenChangeModal = () => {
    setFile(undefined);
    setPhoto("");
    onOpenChange();
  };
  const onChooseFile = () => {
    inputRef.current?.click();
  };
  const handleUpload = () => {
    onFileChange(file);
    setPhoto("");
    setFile(undefined);
  };

  return (
    <>
      <Button
        className="text-tiny"
        color="primary"
        radius="full"
        size="sm"
        onPress={onOpen}
      >
        Change
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChangeModal} size="2xl">
        <ModalContent className="pt-12">
          {(onClose) => (
            <>
              <ModalBody className="flex flex-col items-center">
                {/* I can't get Avatar to limit image size to 200px */}
                {photo ? (
                  <Image
                    removeWrapper
                    alt="Profile Picture"
                    className="object-cover"
                    src={photo}
                    height={200}
                    width={200}
                  />
                ) : (
                  ""
                )}
              </ModalBody>
              <ModalFooter className="justify-center items-center">
                <Button onClick={onChooseFile}> Choose File </Button>
                <p>{file ? file.name : "Choose a profile picture"}</p>
                <input
                  type="file"
                  className="hidden"
                  onChange={handlePhotoChange}
                  ref={inputRef}
                />
                <Button
                  onClick={() => {
                    handleUpload();
                    onClose();
                  }}
                >
                  {" "}
                  Upload{" "}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
