import { ChangeEvent, MouseEvent, useState } from "react";
import { Input } from "../ui/input";

interface Props {
  expectedFileTypes: string[];
  onFileUpload: (fileContent: string) => void;
  // onError: (error: string) => void;
  errorMessage?: string;
}

const FileUpload = ({
  expectedFileTypes,
  onFileUpload,
  errorMessage,
}: Props) => {
  const [isError, setIsError] = useState(false);

  const acceptedFileTypes = expectedFileTypes.join(", ");

  const readFileContent = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    if (!file) {
      setIsError(true);
      onFileUpload("");
      return;
    }

    if (!expectedFileTypes.includes(file.type)) {
      setIsError(true);
      onFileUpload("");
      return;
    }

    reader.onload = (e) => {
      const fileContent = e.target?.result as string;

      // emit the file content to the parent component
      onFileUpload(fileContent);
    };

    reader.readAsText(file);
  };

  // reset the file input value to allow the same file to be uploaded again
  const resetFileContent = (event: MouseEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    input.value = "";
    setIsError(false);
  };

  return (
    <div>
      <Input
        type="file"
        accept={acceptedFileTypes}
        onChange={readFileContent}
        onClick={resetFileContent}
      />
      {isError && (
        <div className="text-danger text-tiny mt-1">{errorMessage}</div>
      )}
    </div>
  );
};

export default FileUpload;
