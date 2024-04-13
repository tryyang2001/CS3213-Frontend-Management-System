import { ChangeEvent, MouseEvent, useState } from "react";
import { Input } from "../ui/input";

interface Props {
  expectedFileTypes: string[];
  onFileUpload: (fileContent: string) => void;
  isTestCasesInput?: boolean;
  errorMessage?: string;
}

function FileUpload({
  expectedFileTypes,
  onFileUpload,
  isTestCasesInput,
  errorMessage,
}: Props) {
  const [isError, setIsError] = useState(false);

  // add "." in front of the file types
  const acceptedFileTypes = expectedFileTypes
    .map((fileType) => `.${fileType}`)
    .join(", ");

  const readFileContent = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    if (!file) {
      setIsError(true);
      onFileUpload("");
      return;
    }

    // only the last "." is the file type
    const fileType = file.name.split(".").pop();

    if (!fileType) {
      setIsError(true);
      onFileUpload("");
      return;
    }

    if (!expectedFileTypes.includes(fileType)) {
      setIsError(true);
      onFileUpload("");
      return;
    }

    if (isTestCasesInput) {
      // ensure the received content is an array, and each object in the array has input and output keys
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;

        try {
          const parsedContent = JSON.parse(fileContent) as TestCase[];

          if (!Array.isArray(parsedContent)) {
            setIsError(true);
            onFileUpload("");
            return;
          }

          for (const obj of parsedContent) {
            if (!obj.input || !obj.output) {
              setIsError(true);
              onFileUpload("");
              return;
            }

            if (!obj.isPublic) {
              obj.isPublic = true;
            }
          }

          // emit the file content to the parent component
          onFileUpload(fileContent);
        } catch (_error) {
          setIsError(true);
          onFileUpload("");
        }
      };
    } else {
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;

        // emit the file content to the parent component
        onFileUpload(fileContent);
      };
    }

    reader.readAsText(file);
  };

  // reset the file input value to allow the same file to be uploaded again
  const resetFileContent = (event: MouseEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
    input.value = "";

    onFileUpload("");
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
}

export default FileUpload;
