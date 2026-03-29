/**
 * Replace this with your own logo component.
 * It must accept { size?: number; className?: string }.
 */
export function LogoIcon({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="10" className="fill-teal-600" />
      <rect x="7" y="17" width="3.6" height="9" rx="1.8" fill="white" />
      <rect x="12.8" y="12" width="3.6" height="16" rx="1.8" fill="white" />
      <rect x="18.6" y="8" width="3.6" height="24" rx="1.8" className="fill-amber-400" />
      <rect x="24.4" y="12" width="3.6" height="16" rx="1.8" fill="white" />
      <rect x="30.2" y="17" width="3.6" height="9" rx="1.8" fill="white" />
    </svg>
  );
}
