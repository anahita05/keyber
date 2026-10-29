"use client";

import dynamic from "next/dynamic";

/**
 * WebGL only exists in the browser, so the scene is loaded client-side only.
 */
const KeyboardScene = dynamic(() => import("./KeyboardScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="h-2 w-2 animate-ping rounded-full bg-white/60" />
    </div>
  ),
});

export function KeyboardCanvas() {
  return (
    <div className="absolute inset-0">
      <KeyboardScene />
    </div>
  );
}
