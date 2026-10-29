"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const t = useTranslations("Nav");
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur relative">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-primary" onClick={closeMenu}>
          {t("brand")}
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            {t("home")}
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            {t("about")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex sm:items-center sm:gap-3">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="sm:hidden"
            aria-label={isOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <nav className="animate-fade-in absolute inset-x-0 top-full flex flex-col gap-1 border-t border-border bg-background px-6 py-4 shadow-lg sm:hidden">
          <Link
            href="/"
            onClick={closeMenu}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
          >
            {t("home")}
          </Link>
          <Link
            href="/about"
            onClick={closeMenu}
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-primary"
          >
            {t("about")}
          </Link>

          <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
            <LocaleSwitcher />
            <ThemeSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}