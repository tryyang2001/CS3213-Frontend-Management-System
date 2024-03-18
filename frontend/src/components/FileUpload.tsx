import React, { ChangeEvent, useState } from "react";
import parse from "html-react-parser";
import DateUtils from "@/utils/dateUtils";

interface Props {
  expectedFileTypes: string[];
  questionIndex: number;
  type: string;
  onFileUpload: (
    questionIndex: number,
    type: string,
    fileContent: string
  ) => void;
}

export function FileUpload({
  expectedFileTypes,
  questionIndex,
  type,
  onFileUpload,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isValidFile, setIsValidFile] = useState<boolean>(true);

  const getExtension = (filename: string) => {
    const parts = filename.split(".");
    return parts[parts.length - 1];
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      file
        .text()
        .then((fileContent) => {
          const extension = getExtension(file.name);
          if (!expectedFileTypes.includes(extension)) {
            setIsValidFile(false);
            onFileUpload(questionIndex, type, "");
          } else {
            setIsValidFile(true);
            onFileUpload(questionIndex, type, fileContent);
          }
          setFileContent(fileContent);
        })
        .catch(() => console.log("This should succeed"));
    } else {
      setSelectedFile(null);
      setFileContent("");
      onFileUpload(questionIndex, type, "");
    }
  };

  const renderPreview = () => {
    if (isValidFile) {
      if (selectedFile && fileContent) {
        const extension = getExtension(selectedFile?.name);
        let content;
        if (extension === "html") {
          content = parse(fileContent);
        } else if (extension === "py" || extension === "java") {
          content = <pre>{fileContent}</pre>;
        }
        return (
          <div>
            {content}
            <p>File Name: {selectedFile.name}</p>
            <p>
              Last Modified:{" "}
              {DateUtils.parseTimestampToDate(selectedFile.lastModified)}
            </p>
          </div>
        );
      }
      return <div>Select a file to upload</div>;
    } else {
      return (
        <div>
          Invalid file type.
          <br />
          Please upload a file with one of the following types:{" "}
          {expectedFileTypes.join(",")}
        </div>
      );
    }
  };

  return (
    <div>
      {renderPreview()}
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}
