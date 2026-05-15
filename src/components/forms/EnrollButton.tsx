"use client";

import { useEnrollStore } from "@/lib/enroll-store";

type Props = {
  label: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: "h-9 px-5 text-sm",
  md: "h-11 px-7 text-sm",
  lg: "h-14 px-10 text-base",
};

export function EnrollButton({ label, size = "md", fullWidth = false, className }: Props) {
  const open = useEnrollStore((s) => s.open);

  return (
    <button
      onClick={open}
      style={fullWidth ? undefined : { width: "fit-content" }}
      className={[
        "inline-flex items-center justify-center rounded-full font-semibold text-white",
        fullWidth ? "w-full" : "",
        "bg-gradient-to-r from-accent-500 to-accent-600",
        "shadow-lg shadow-orange-500/20 transition-all",
        "hover:from-accent-400 hover:to-accent-500 hover:shadow-orange-500/35 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
        sizeClasses[size],
        className ?? "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
