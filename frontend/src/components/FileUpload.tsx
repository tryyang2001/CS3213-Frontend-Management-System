import React, { ChangeEvent, useState } from "react";
import parse from "html-react-parser";

export const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setSelectedFile(file);
        file.text().then((fileContent) => {
          setFileContent(fileContent);
        });
    }
  };

  const formatDate = (dateString: number) => {
    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          {selectedFile.type === 'text/html' && fileContent ? parse(fileContent) : <pre>{fileContent}</pre>}
          <p>File Name: {selectedFile.name}</p>
          <p>
            Last Modified:{" "} {formatDate(selectedFile.lastModified)}
          </p>
        </div>
      );
    } else {
      return <div>Select a file to upload</div>
    }
  };

  return (
    <div>
      {fileData()}
      <input
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
};
