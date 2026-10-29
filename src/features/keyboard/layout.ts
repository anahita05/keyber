/**
 * 75% ANSI keyboard layout.
 *
 * Every key is described in "units" (u). 1u = one standard alpha key.
 * `gap` adds empty space *before* a key, so the function row can be split
 * into clusters without inventing fake keys.
 *
 * `code` matches `KeyboardEvent.code`, so in part 2 (clicking / typing)
 * physical key presses can be mapped straight onto these keycaps.
 */

export interface KeyDef {
  /** KeyboardEvent.code */
  code: string;
  /** Text printed on the keycap */
  label: string;
  /** Width in units (default 1) */
  w?: number;
  /** Empty space before this key, in units */
  gap?: number;
  /** Rotation of the legend in radians (used for arrow keys) */
  legendRotation?: number;
}

export type KeyRow = KeyDef[];

const letters = (chars: string): KeyDef[] =>
  chars.split("").map((c) => ({
    code: /[a-z]/.test(c) ? `Key${c.toUpperCase()}` : c,
    label: c,
  }));

const fn = (n: number): KeyDef => ({ code: `F${n}`, label: `f${n}` });

export const KEYBOARD_LAYOUT: KeyRow[] = [
  // Function row
  [
    { code: "Escape", label: "esc." },
    { ...fn(1), gap: 0.5 },
    fn(2),
    fn(3),
    fn(4),
    { ...fn(5), gap: 0.5 },
    fn(6),
    fn(7),
    fn(8),
    { ...fn(9), gap: 0.5 },
    fn(10),
    fn(11),
    fn(12),
    { code: "Delete", label: "del.", gap: 0.5 },
  ],
  // Number row
  [
    { code: "Backquote", label: "`" },
    { code: "Digit1", label: "1" },
    { code: "Digit2", label: "2" },
    { code: "Digit3", label: "3" },
    { code: "Digit4", label: "4" },
    { code: "Digit5", label: "5" },
    { code: "Digit6", label: "6" },
    { code: "Digit7", label: "7" },
    { code: "Digit8", label: "8" },
    { code: "Digit9", label: "9" },
    { code: "Digit0", label: "0" },
    { code: "Minus", label: "-" },
    { code: "Equal", label: "=" },
    { code: "Backspace", label: "back.", w: 2 },
    { code: "Home", label: "home." },
  ],
  // QWERTY row
  [
    { code: "Tab", label: "tab.", w: 1.5 },
    ...letters("qwertyuiop"),
    { code: "BracketLeft", label: "[" },
    { code: "BracketRight", label: "]" },
    { code: "Backslash", label: "\\", w: 1.5 },
    { code: "PageUp", label: "pgup." },
  ],
  // Home row
  [
    { code: "CapsLock", label: "caps.", w: 1.75 },
    ...letters("asdfghjkl"),
    { code: "Semicolon", label: ";" },
    { code: "Quote", label: "'" },
    { code: "Enter", label: "enter.", w: 2.25 },
    { code: "PageDown", label: "pgdn." },
  ],
  // Bottom alpha row
  [
    { code: "ShiftLeft", label: "shift.", w: 2.25 },
    ...letters("zxcvbnm"),
    { code: "Comma", label: "," },
    { code: "Period", label: "." },
    { code: "Slash", label: "/" },
    { code: "ShiftRight", label: "shift.", w: 1.75 },
    { code: "ArrowUp", label: "↑" },
    { code: "End", label: "end." },
  ],
  // Modifier row
  [
    { code: "ControlLeft", label: "ctrl.", w: 1.25 },
    { code: "MetaLeft", label: "cmd.", w: 1.25 },
    { code: "AltLeft", label: "alt.", w: 1.25 },
    { code: "Space", label: "", w: 6.25 },
    { code: "AltRight", label: "alt." },
    { code: "Fn", label: "fn." },
    { code: "ControlRight", label: "ctrl." },
    { code: "ArrowLeft", label: "↑", legendRotation: Math.PI / 2 },
    { code: "ArrowDown", label: "↓" },
    { code: "ArrowRight", label: "↑", legendRotation: -Math.PI / 2 },
  ],
];

/** Extra vertical space between the function row and the rest (in units). */
export const FUNCTION_ROW_GAP = 0.3;

export interface PlacedKey extends KeyDef {
  w: number;
  /** Center position in units, origin at the keyboard's center */
  x: number;
  z: number;
}

/** Resolves the row data into centered (x, z) positions. */
export function placeKeys(rows: KeyRow[] = KEYBOARD_LAYOUT) {
  const placed: PlacedKey[] = [];
  let maxWidth = 0;
  let z = 0;

  rows.forEach((row, rowIndex) => {
    if (rowIndex === 1) z += FUNCTION_ROW_GAP;
    let x = 0;
    for (const key of row) {
      const w = key.w ?? 1;
      x += key.gap ?? 0;
      placed.push({ ...key, w, x: x + w / 2, z: z + 0.5 });
      x += w;
    }
    maxWidth = Math.max(maxWidth, x);
    z += 1;
  });

  const depth = z;
  for (const key of placed) {
    key.x -= maxWidth / 2;
    key.z -= depth / 2;
  }

  return { keys: placed, width: maxWidth, depth };
}
