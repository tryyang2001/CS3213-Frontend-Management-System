import React, { ChangeEvent, useEffect, useState } from "react";
import parse from "html-react-parser";
import DateUtils from "@/utils/dateUtils";

interface Props {
  expectedFileTypes: string[];
}

export const FileUpload = ({expectedFileTypes}: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isValidFile, setIsValidFile] = useState<boolean>(true);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setSelectedFile(file);
        file.text().then((fileContent) => {
          setFileContent(fileContent);
        });
    } else {
      setSelectedFile(null);
      setFileContent(null);
    }
  };

  function getExtension(filename: string) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }

  useEffect(() => {
    if (selectedFile && fileContent) {
      var extension = getExtension(selectedFile?.name);
      if (!expectedFileTypes.includes(extension)) {
        setIsValidFile(false);
      } else {
        setIsValidFile(true);
      }
    }
  }, [fileContent, expectedFileTypes]);

  const renderPreview = () => {
    if (isValidFile) {
      if (selectedFile && fileContent) {
        var extension = getExtension(selectedFile?.name);
        let content;
        if (extension === 'html') {
          content = parse(fileContent);
        } else if (extension === 'py' || extension === 'java') {
          content = <pre>{fileContent}</pre>;
        }
        return (
          <div>
            {content}
            <p>File Name: {selectedFile.name}</p>
            <p>Last Modified: {DateUtils.parseTimestampToDate(selectedFile.lastModified)}</p>
          </div>
        )
      } 
      return <div>Select a file to upload</div>;
    } else {
      return (
        <div>
          Invalid file type.<br/>
          Please upload a file with one of the following types: {expectedFileTypes.join(",")}
        </div>
      );
    }
  };

  return (
    <div>
      {renderPreview()}
      <input
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
};
