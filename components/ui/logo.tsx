interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 64, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M32 12C20.9543 12 12 20.9543 12 32C12 39.4674 16.103 45.9691 22 49.3333V52C22 54.2091 23.7909 56 26 56H28C30.2091 56 32 54.2091 32 52V49.9C39.4939 49.5292 46.1664 45.3375 49.9 39.1111L48.1679 38.1111C44.7578 43.8 38.6946 47.6046 31.9059 47.9056L31.8105 47.9016L31.7144 47.925C31.8087 47.922 31.9042 47.9172 32 47.9111V52C32 54.2091 33.7909 56 36 56H38C40.2091 56 42 54.2091 42 52V49.3333C47.897 45.9691 52 39.4674 52 32C52 20.9543 43.0457 12 32 12Z"
        fill="#1C1C1C"
      />
      <circle cx="24" cy="30" r="4" fill="#1C1C1C" />
      <circle cx="40" cy="30" r="4" fill="#1C1C1C" />
      <path
        d="M26 38C26 38 29 42 32 42C35 42 38 38 38 38"
        stroke="#1C1C1C"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}
