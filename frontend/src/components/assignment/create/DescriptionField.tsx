import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

interface Props {
  value?: string;
  handleValueChanges: (value: string) => void;
  isReadOnly?: boolean;
  isInvalid: boolean;
  errorMessage: string;
  placeholder?: string;
  className?: string;
}

const modules = {
  toolbar: {
    container: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      // ["link", "image"],
      ["clean"],
    ],
    handlers: {
      // image: imageCompressor
    },
  },
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  // "image",
];

function DescriptionField({
  value,
  handleValueChanges,
  isReadOnly = false,
  isInvalid,
  errorMessage,
  placeholder,
  className,
}: Props) {
  // ReactQuill is a component generated
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  return (
    <div className={className}>
      <ReactQuill
        value={value}
        onChange={handleValueChanges}
        placeholder={placeholder}
        readOnly={isReadOnly}
        formats={formats}
        modules={modules}
        theme="snow"
        className={isInvalid ? "bg-danger-50" : ""}
      />
      {isInvalid && (
        <div className="text-danger text-tiny mt-1">{errorMessage}</div>
      )}
    </div>
  );
}

export default DescriptionField;
