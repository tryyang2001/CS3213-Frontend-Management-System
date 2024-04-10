import { ReactNode } from "react";

interface Props {
  isRequired?: boolean;
  children: ReactNode;
}

function FieldLabel({ isRequired = false, children }: Props) {
  return (
    <div className="flex items-center text-black font-semibold col-span-3">
      {children} {isRequired && <span className="text-red-700">*</span>}
    </div>
  );
}

export default FieldLabel;
