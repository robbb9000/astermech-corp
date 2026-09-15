import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  title?: string;
};

export function Logo({ className, title = "AsterMech" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("block", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M16 5 L28 27 H4 Z M16 12.5 L21.2 23 H10.8 Z"
      />
    </svg>
  );
}
