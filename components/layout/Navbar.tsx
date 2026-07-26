"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";

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

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  function handleLogout() {
    localStorage.removeItem("token");

    toast.success("Logged out successfully.");

    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/30">
            <Sparkles
              size={20}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              FollowUp AI
            </h1>

            <p className="text-xs text-slate-400">
              AI Meeting Assistant
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="ml-2 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-all hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>

        {/* Mobile Button */}
        <button
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
        >
          {mobileMenuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-5 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-red-500/40 px-4 py-3 text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}