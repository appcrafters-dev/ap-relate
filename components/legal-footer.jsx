"use client";
import { LinkSignpost } from "@/components/ui/buttons";

const links = [
  {
    href: "/login",
    label: "Client Login",
  },
  {
    href: "/privacy-policy",
    label: "Privacy Policy",
  },
  {
    href: "/client-waiver",
    label: "Waiver",
  },
  {
    href: "https://www.totalfamily.io",
    label: "totalfamily.io",
  },
];

export default function LegalFooter() {
  return (
    <footer className="mt-12 border-t pt-8">
      <ul className="flex flex-wrap justify-center space-x-8 text-sm font-medium text-gray-500">
        {links.map((link) => (
          <li key={link.href}>
            <LinkSignpost href={link.href}>{link.label}</LinkSignpost>
          </li>
        ))}
      </ul>
    </footer>
  );
}
