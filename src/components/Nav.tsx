import Link from "next/link";
import { navLinks, siteConfig } from "@/lib/content";

export function Nav() {
  return (
    <nav>
      <div className="nav-mark">{siteConfig.name} ✳</div>
      <div className="nav-links">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
