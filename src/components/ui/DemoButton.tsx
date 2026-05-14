import Link from "next/link";

type Props = {
  locale: string;
  label: string;
  size?: "md" | "lg";
  variant?: "brand" | "white";
  className?: string;
};

const sizeClasses = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

const variantClasses = {
  brand:
    "bg-brand-600 text-white shadow-brand hover:bg-brand-700 focus-visible:ring-ring focus-visible:ring-offset-2",
  white:
    "bg-white text-brand-700 shadow-modal hover:bg-brand-50 hover:scale-105 focus-visible:ring-white focus-visible:ring-offset-brand-600",
};

export function DemoButton({
  locale,
  label,
  size = "md",
  variant = "brand",
  className = "",
}: Props) {
  return (
    <Link
      href={`/${locale}/demo`}
      className={[
        "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold",
        "transition-all active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      <span aria-hidden="true" className="text-2xl leading-none">🎮</span>
      {label}
    </Link>
  );
}
