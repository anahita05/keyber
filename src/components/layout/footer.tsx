import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-border py-6">
      <p className="mx-auto max-w-5xl px-6 text-center text-sm text-muted-foreground">
        {t("text")}
      </p>
    </footer>
  );
}
