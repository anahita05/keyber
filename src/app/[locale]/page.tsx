import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { KeyboardCanvas } from "@/features/keyboard/KeyboardCanvas";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("Home");

  return (
    <section className="relative h-[calc(100svh-4.5rem)] min-h-[520px] w-full overflow-hidden bg-black">
      <KeyboardCanvas />

      {/* Overlay copy — pointer-events-none so dragging still reaches the canvas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-6 px-6 pb-8 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pb-10">
        <div className="animate-fade-in max-w-md">
          <p className="mb-3 ltr:font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            {t("eyebrow")}
          </p>
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            <bdi>{t("title")}</bdi>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">
            {t("subtitle")}
          </p>
        </div>
        <p className="ltr:font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
          {t("hint")}
        </p>
      </div>
    </section>
  );
}
