"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuButtonRef = useRef(null);
  const pathname = usePathname();

  const links = [
    { href: "/home", label: "Home" },
    { href: "/jogos", label: "Jogos" },
    { href: "/recomendacoes", label: "Recomendações" },
    { href: "/cyber", label: "Cyber" },
    { href: "/sobre", label: "Sobre" },
  ];

  useEffect(() => {
    if (!menuAberto) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setMenuAberto(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuAberto]);

  function isCurrentRoute(href) {
    return pathname === href || (href !== "/home" && pathname.startsWith(`${href}/`));
  }

  return (
    <header className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <nav
        aria-label="Navegação principal"
        className="rounded-2xl border border-slate-800 bg-[#020817]/95 px-4 py-3 sm:px-6 sm:py-4"
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/home"
            onClick={() => setMenuAberto(false)}
            className="flex shrink-0 items-center gap-2 rounded sm:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400"
          >
            <span
              aria-hidden="true"
              className="relative h-11 w-14 shrink-0 overflow-hidden sm:h-12 sm:w-16"
            >
              <Image
                src="/images/logo.png"
                alt=""
                width={1536}
                height={1024}
                priority
                className="absolute -left-[55px] -top-[61px] h-auto w-64 max-w-none sm:-left-[62px] sm:-top-[68px] sm:w-72"
              />
            </span>
            <span className="whitespace-nowrap font-mono text-sm font-bold tracking-wide text-lime-400 sm:text-lg lg:text-xl">
              HAPPY GAME HUB
            </span>
          </Link>

          <div className="hidden items-center gap-6 font-mono xl:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrentRoute(link.href) ? "page" : undefined}
                className={`whitespace-nowrap rounded-sm border-b-2 py-3 text-base font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-400 ${
                  isCurrentRoute(link.href)
                    ? "border-lime-400 text-lime-400"
                    : "border-transparent text-white hover:border-lime-400 hover:text-lime-400"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/login"
              aria-current={pathname === "/login" ? "page" : undefined}
              className="flex items-center gap-2 rounded-xl border border-lime-400 px-5 py-3 text-base font-semibold tracking-wide text-lime-400 transition-colors hover:bg-lime-400 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
            >
              <User aria-hidden="true" size={18} />
              Login
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lime-400 transition hover:bg-lime-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 xl:hidden"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
          >
            {menuAberto ? (
              <X aria-hidden="true" size={30} />
            ) : (
              <Menu aria-hidden="true" size={30} />
            )}
          </button>
        </div>

        {menuAberto && (
          <div
            id="menu-mobile"
            className="mt-5 flex flex-col gap-2 border-t border-slate-800 pt-5 font-mono xl:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                aria-current={isCurrentRoute(link.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-3 text-base font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-lime-400 ${
                  isCurrentRoute(link.href)
                    ? "bg-lime-400/10 text-lime-400"
                    : "text-white hover:bg-slate-800 hover:text-lime-400"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setMenuAberto(false)}
              aria-current={pathname === "/login" ? "page" : undefined}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-lime-400 px-6 py-3 text-base font-semibold tracking-wide text-lime-400 transition-colors hover:bg-lime-400 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400"
            >
              <User aria-hidden="true" size={18} />
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
