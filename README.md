# keyber. — 3D glass keyboard

The frontend for **keyber**, built on the bilingual Next.js template
(Next.js App Router, next-intl fa/en, Tailwind, Zustand, shadcn/ui) and
**React Three Fiber**.

**Part 1 (this version): the look.** A 75% keyboard with clear glass
keycaps on a black background. The caps are prismatic: color splits at the
edges and highlights slide across them.

## Run

```bash
pnpm install
pnpm dev
# http://localhost:3000/fa  or  /en
```

## Where things live

```
src/features/keyboard/
  layout.ts            # 75% ANSI layout. Keys use KeyboardEvent.code (needed for part 2)
  keycap-geometry.ts   # tapered, rounded keycap with a concave dish, cached per key width
  Keycap.tsx           # one key: switch + stem + glass cap + legend, hover lift
  Keyboard.tsx         # case, all keys, shared glass material + shared refraction buffer
  KeyboardScene.tsx    # Canvas, camera, environment lights, bloom / vignette
  KeyboardCanvas.tsx   # client-only dynamic import (no SSR for WebGL)
  palette.ts           # light colors per theme (navy / pink)
public/fonts/inter-500.woff   # legend font (SIL OFL, see INTER-LICENSE.txt)
```

## How the glass works

- All caps share **one** `MeshTransmissionMaterial`.
- Each frame the scene is rendered **once** into a buffer, with the caps
  hidden and the colorful environment map as the background. Every cap
  samples that buffer, which keeps the cost at one extra pass rather than
  one pass per key.
- The colors come from `Lightformer` panels that exist only inside the
  environment map. You only ever see them reflected and refracted in the
  glass, so the page itself stays pure black.
- The theme switcher (navy / pink) recolors those lights.

## Tuning the look

- Glass: the `<MeshTransmissionMaterial>` props in `Keyboard.tsx`
  (`chromaticAberration`, `distortion`, `iridescence`, `thickness`, …)
- Colors: `palette.ts`
- Where reflections land: the `Lightformer` positions in `KeyboardScene.tsx`
- Key shape: the `KEYCAP` constants in `keycap-geometry.ts`

## Next: part 2

Pressing and clicking keys. `layout.ts` already maps every key to its
`KeyboardEvent.code`, and `Keycap.tsx` already animates its height in
`useFrame` (used for hover now), so the press animation can go in the same
place.
