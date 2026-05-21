type Props = {
  size?: number;
  className?: string;
};

export function Logo({ size = 32, className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16.5 2H47.5A12 12 0 0 1 59.5 14V35.5A12 12 0 0 1 47.5 47.5H36.5L22 62V47.5H16.5A12 12 0 0 1 4.5 35.5V14A12 12 0 0 1 16.5 2Z"
        className="fill-transparent dark:fill-brand-950"
        stroke="#7c3aed"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M32 7Q34 23 50 25 34 27 32 43 30 27 14 25 30 23 32 7Z"
        fill="#f97316"
      />
    </svg>
  );
}
