"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/dashboard/new",
    label: "New Analysis",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");

    router.push("/login");

    router.refresh();
  }

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          FollowUp AI
        </Link>

        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-900"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}