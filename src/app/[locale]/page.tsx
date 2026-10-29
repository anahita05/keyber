import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Languages, Palette, Database, LayoutGrid } from "lucide-react";

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

  const features = [
    { icon: Languages, title: t("feature1Title"), desc: t("feature1Desc") },
    { icon: Palette, title: t("feature2Title"), desc: t("feature2Desc") },
    { icon: Database, title: t("feature3Title"), desc: t("feature3Desc") },
    { icon: LayoutGrid, title: t("feature4Title"), desc: t("feature4Desc") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <section className="animate-fade-in text-center">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          {t("subtitle")}
        </p>
        <Button asChild size="lg" className="mt-8">
          <a
            href="https://github.com/anahita05/template-next.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("cta")}
          </a>
        </Button>
      </section>

      <section className="mt-20">
        <h2 className="mb-8 text-center text-2xl font-semibold">
          {t("featuresTitle")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((f, i) => (
            <Card
              key={f.title}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader>
                <f.icon className="h-8 w-8 text-primary" />
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <Card>
          <CardHeader>
            <CardTitle>{t("stackTitle")}</CardTitle>
            <CardDescription>{t("stackDesc")}</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
