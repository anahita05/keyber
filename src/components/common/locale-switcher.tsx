"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale() {
    const nextLocale = locale === "fa" ? "en" : "fa";
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <Button variant="secondary" size="sm" onClick={switchLocale}>
      {locale === "fa" ? "EN" : "فا"}
    </Button>
  );
}
