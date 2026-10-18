import Image from "next/image";

type WaveDividerProps = {
  direction: "into-dark" | "into-light";
};

export default function WaveDivider({ direction }: WaveDividerProps) {
  const isIntoDark = direction === "into-dark";

  return (
    <div
      aria-hidden="true"
      className="relative -my-0.5 h-[clamp(2rem,6vw,5rem)] bg-[#faeee6]"
    >
      <Image
        alt=""
        className="object-fill scale-y-[1.05]"
        fill
        sizes="100vw"
        src="/Wave%20Divider/waves2.svg"
        style={isIntoDark ? { transform: "scaleY(-1.05)" } : undefined}
      />
    </div>
  );
}
