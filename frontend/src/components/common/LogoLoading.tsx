import ITSLogo from "./ITSLogo";

interface Props {
  minHeight?: number;
}

export default function LogoLoading({ minHeight }: Props) {
  return (
    <div
      style={{ height: minHeight ? `${minHeight}px` : `100vh` }}
      className="flex flex-col items-center justify-center"
    >
      <div className="flex items-center justify-center object-cover">
        <ITSLogo />
      </div>

      <div className="mx-2 -mt-2 z-20">
        <div className="flex items-center justify-center">Loading...</div>
        <div className="relative w-64 space-y-3 overflow-hidden rounded-md bg-logo p-3 shadow before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-slate-200 hover:shadow-lg before:animate-[shimmer_1.5s_infinite]" />
      </div>
    </div>
  );
};
