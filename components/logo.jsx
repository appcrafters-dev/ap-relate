import Link from "next/link";

export default function Logo({ width, height, href = "/login" }) {
  return (
    <Link href={href} passHref>
      <img
        src="/img/tfm-logo.png"
        alt="Total Family Management Logo"
        width={width}
        height={height}
      />
    </Link>
  );
}
