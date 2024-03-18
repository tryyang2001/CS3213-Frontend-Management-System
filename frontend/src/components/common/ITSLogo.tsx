import { Image } from "@nextui-org/react";

interface Props {
  width?: string;
  height?: string;
}

function ITSLogo({ width = "100%", height = "100%" }: Props) {
  return (
    <Image
      src="/logo.svg"
      className="bg-logo mx-auto -mb-4 z-0"
      width={width}
      height={height}
      alt="ITS logo"
    />
  );
};

export default ITSLogo;
