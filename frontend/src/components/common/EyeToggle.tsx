import { Dispatch, SetStateAction } from "react";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";

interface Props {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

export default function Eye({ isVisible, setIsVisible }: Props) {
  return (
    <button
      className="focus:outline-none"
      type="button"
      onClick={() => setIsVisible(!isVisible)}
    >
      {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
    </button>
  );
}
