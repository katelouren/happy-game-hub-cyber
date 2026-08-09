"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  const links = [
    { href: "/home", label: "Home" },
    { href: "/jogos", label: "Jogos" },
    { href: "/recomendacoes", label: "Recomendações" },
    { href: "/sobre", label: "Sobre" },
  ];

  return (
    <header className="mx-auto max-w-7xl px-8 pt-6">
      <nav className="rounded-2xl border border-slate-800 bg-[#020817]/95 px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Happy Game Hub"
              width={250}
              height={90}
              priority
            />
          </Link>

          <div className="hidden items-center gap-12 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b-2 border-transparent pb-2 text-base font-semibold text-white transition hover:border-lime-400 hover:text-lime-400"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl border border-lime-400 px-6 py-3 text-base font-bold text-lime-400 transition hover:bg-lime-400 hover:text-slate-950"
            >
              <User size={18} />
              Login
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="text-lime-400 md:hidden"
            aria-label="Abrir menu"
          >
            {menuAberto ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {menuAberto && (
          <div className="mt-6 flex flex-col gap-4 border-t border-slate-800 pt-6 md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className="text-lg font-semibold text-white hover:text-lime-400"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setMenuAberto(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-lime-400 px-6 py-3 font-bold text-lime-400"
            >
              <User size={18} />
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}