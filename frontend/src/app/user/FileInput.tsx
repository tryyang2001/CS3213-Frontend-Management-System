"use client";

import { Button, Modal, ModalBody, ModalContent, Image, useDisclosure } from "@nextui-org/react";
import { useState } from "react";

export default function FileInput({onFileChange} : {onFileChange: Function}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    
    
    return <>
        <Button className="text-tiny" color="primary" 
            radius="full" size="sm" onPress={onOpen}>
            Change
        </Button>
        <ModalUpload isOpen={isOpen} onOpenChange={onOpenChange} onUpload={onFileChange}/>
    </>
}

function ModalUpload ({isOpen, onOpenChange, onUpload} : {isOpen: boolean, onOpenChange: VoidFunction, onUpload: Function}) {

    const [photo, setPhoto] = useState<string>(""); 
    const [file, setFile] = useState<File>();
    const onChangePhoto = (event : React.ChangeEvent<HTMLInputElement>) => {
        const upload = event.target.files?.[0];
        if (upload) {
            const fileURL = URL.createObjectURL(upload);
            setFile(upload)
            setPhoto(fileURL)
        } else {
            setPhoto("")
        }
    }

    const onOpenChangeModal = () => {
      setFile(undefined);
      setPhoto("");
      onOpenChange()
    }

    const handleUpload = () => {
        console.log("Uploading"  + file);
        onUpload(file);
        onOpenChange();
        setPhoto("");
        setFile(undefined);
    }

    return <Modal isOpen={isOpen} onOpenChange={onOpenChangeModal}>
    <ModalContent className="pt-12">
      {(onClose) => (
        <>
          <ModalBody className="flex flex-col items-center">
            {photo? <Image
                removeWrapper
                alt="Profile Picture"
                className="object-cover"
                src={photo}
                height={200}
                width={200}
            />
            : ""
            }
            <div className="flex flex-row">
                <input type="file" onChange={onChangePhoto}></input>
                <Button onClick={handleUpload}> upload </Button>
            </div>
          </ModalBody>
        </>
      )}
    </ModalContent>
  </Modal>
}