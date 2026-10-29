# Next.js Bilingual Template

A complete and production-ready Next.js template for quickly starting new projects. It includes bilingual support (Persian/English), two color themes, state management with Zustand, and reusable shadcn/ui components.

## Prerequisites

Make sure the following tools are installed on your system before running the project.

| Tool | Recommended Version | Download / Installation |
|------|---------------------|-------------------------|
| Node.js | `>= 20.11.0` (LTS) — Minimum `18.18.0` | https://nodejs.org |
| pnpm | `>= 9.0.0` | Install with: `npm install -g pnpm` |

Verify your installed versions:

```bash
node -v
pnpm -v
```

## Installation & Development

```bash
pnpm install

pnpm dev

pnpm build
pnpm start

pnpm lint
```

The application will be available at `http://localhost:3000` and will automatically redirect to `/fa` (the default language).

---

## Main Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.3.3 | Main framework (App Router) |
| `react` / `react-dom` | 19.1.0 | User interface library |
| `next-intl` | 3.26.3 | Internationalization (Persian/English) — https://next-intl.dev |
| `zustand` | 5.0.3 | State management with localStorage persistence |
| `tailwindcss` | 3.4.17 | Utility-first CSS framework |
| `class-variance-authority`, `clsx`, `tailwind-merge` | - | Utilities used by shadcn/ui components |
| `lucide-react` | 0.469.0 | Icon library |
| `eslint` + `eslint-config-next` | - | Linting and code quality |

---

## Why shadcn/ui Instead of HeroUI?

According to the project requirements, one of these two component libraries had to be selected. **shadcn/ui** was chosen because:

- Unlike HeroUI, which is a traditional component library, **shadcn/ui copies the component source code directly into your project**, giving you complete control over styling and behavior. This makes it ideal for reusable templates.
- It is built directly on top of Tailwind CSS and global CSS variables, making it a perfect fit for this project's theme system.
- It has become the de facto standard component solution in the modern Next.js + Tailwind ecosystem.
- This project implements the `Button` and `Card` components using the shadcn/ui pattern inside `src/components/ui`.

---

## Project Structure

```text
src/
├── app/
│   ├── globals.css              # Global colors and CSS variables
│   └── [locale]/                # All pages are nested under locale routes
│       ├── layout.tsx           # Root layout (html, text direction, providers)
│       ├── page.tsx             # Landing page
│       └── about/page.tsx       # About page
├── components/
│   ├── ui/                      # Base shadcn/ui components (Button, Card)
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── theme-switcher.tsx       # Theme toggle with animation
│   ├── theme-initializer.tsx    # Prevents incorrect theme flash on initial load
│   └── locale-switcher.tsx      # Language switcher
├── i18n/                        # next-intl configuration (routing, navigation, request)
├── store/
│   └── useThemeStore.ts         # Zustand store with localStorage persistence
└── lib/
    └── utils.ts                 # Shared cn() utility for Tailwind class merging

messages/
├── fa.json                      # Persian translations
└── en.json                      # English translations
```

---

## Architecture

The project follows a **Monolithic Architecture**.

All frontend code—including pages, components, global state, translations, and utilities—is maintained inside a single repository. Unlike a Monorepo or Micro-Frontend architecture, there is no separation into multiple services or packages.

---

## DRY Principle

The project follows the **Don't Repeat Yourself (DRY)** principle throughout its structure.

### Colors

All theme colors are defined only once in `globals.css` using CSS variables. No colors are hardcoded elsewhere in the project. Components simply use Tailwind utility classes mapped to these variables, such as:

- `bg-primary`
- `text-primary-700`
- etc.

### UI Components

Instead of repeating styles across pages, reusable components such as `Button` and `Card` are created once inside `components/ui` and reused throughout the project.

### Shared Layout

The `Navbar` and `Footer` components are implemented once and included in the shared layout, making them automatically available across all pages.

---

## Theme System

The application includes two built-in themes, controlled through the `data-theme` attribute on the `<html>` element.

The selected theme is persisted in `localStorage` using the key:

```text
app-theme-storage
```

Available themes:

- `navy` (default)
- `pink`

Users can switch themes using the palette button in the navigation bar. The transition includes a custom `theme-pulse` animation along with smooth background and text color transitions.

---

## Internationalization (i18n)

The project uses **next-intl** for multilingual support.

All routes include a locale prefix:

```text
/fa
/en
```

The page direction (`rtl` or `ltr`) is automatically determined based on the selected language.

---

## Design Philosophy

As required by the project specification, the UI has intentionally been kept clean and minimal. The primary focus is on maintainable architecture, reusable components, scalability, and clean code rather than complex visual effects or elaborate interface design.