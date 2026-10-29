"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Environment,
  Lightformer,
  PresentationControls,
} from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { ACESFilmicToneMapping, type Group, type PerspectiveCamera } from "three";
import { useThemeStore } from "@/store/useThemeStore";
import { Keyboard } from "./Keyboard";
import { SCENE_PALETTES, type ScenePalette } from "./palette";

/**
 * Colored light panels that only exist inside the environment map.
 * They never show up directly on the black background — you only see
 * them reflected and refracted in the glass. They drift slowly so the
 * highlights keep sliding across the keycaps.
 */
function Lights({ palette }: { palette: ScenePalette }) {
  const rig = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (rig.current) rig.current.rotation.y = clock.getElapsedTime() * 0.12;
  });

  return (
    <Environment resolution={256} frames={Infinity} background={false}>
      <color attach="background" args={["#000000"]} />
      <group ref={rig}>
        {/* Soft key light straight above */}
        <Lightformer form="rect" intensity={2.5} color="#ffffff" position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />

        {/* Above & behind the board — this is what the top faces mirror */}
        <Lightformer form="rect" intensity={7} color={palette.warm} position={[-4, 6, -6]} target={[0, 0, 0]} scale={[4, 2.5, 1]} />
        <Lightformer form="rect" intensity={7} color={palette.cool} position={[4, 6, -6]} target={[0, 0, 0]} scale={[4, 2.5, 1]} />
        <Lightformer form="rect" intensity={12} color="#ffffff" position={[0, 7, -5]} target={[0, 0, 0]} scale={[12, 0.15, 1]} />

        {/* In front & above — mirrored by the front walls facing the camera */}
        <Lightformer form="rect" intensity={12} color={palette.streakA} position={[-4, 4, 8]} target={[0, 0, 0]} scale={[0.35, 6, 1]} />
        <Lightformer form="rect" intensity={12} color={palette.streakB} position={[4, 4, 8]} target={[0, 0, 0]} scale={[0.35, 6, 1]} />
        <Lightformer form="rect" intensity={6} color={palette.warm} position={[0, 5, 9]} target={[0, 0, 0]} scale={[6, 1, 1]} />

        {/* Left / right walls */}
        <Lightformer form="rect" intensity={6} color={palette.warm} position={[-8, 2, 0]} target={[0, 0, 0]} scale={[5, 3, 1]} />
        <Lightformer form="rect" intensity={6} color={palette.cool} position={[8, 2, 0]} target={[0, 0, 0]} scale={[5, 3, 1]} />
        <Lightformer form="ring" intensity={5} color={palette.streakB} position={[-5, 5, -3]} target={[0, 0, 0]} scale={2} />

        {/*
          Below the board. Never reflected by the caps' top faces, but this is
          what you look *through* the glass at — it's the colour you see
          inside each keycap (see GlassBuffer in Keyboard.tsx).
        */}
        <Lightformer form="rect" intensity={8} color={palette.warm} position={[-5, -6, -3]} target={[0, 0, 0]} scale={[6, 8, 1]} />
        <Lightformer form="rect" intensity={8} color={palette.cool} position={[5, -6, -4]} target={[0, 0, 0]} scale={[6, 8, 1]} />
        <Lightformer form="rect" intensity={14} color={palette.streakA} position={[0, -6, -7]} target={[0, 0, 0]} scale={[14, 0.6, 1]} />
        <Lightformer form="rect" intensity={14} color="#ffffff" position={[-1.5, -6, 1]} target={[0, 0, 0]} scale={[0.3, 12, 1]} />
        <Lightformer form="rect" intensity={12} color={palette.streakB} position={[6, -5, 2]} target={[0, 0, 0]} scale={[0.6, 10, 1]} />
        <Lightformer form="rect" intensity={10} color={palette.warm} position={[-6, -4, 4]} target={[0, 0, 0]} scale={[0.6, 10, 1]} />
      </group>
    </Environment>
  );
}

/** Pulls the camera back on narrow screens so the whole board stays in frame. */
function ResponsiveCamera() {
  const camera = useThree((s) => s.camera as PerspectiveCamera);
  const aspect = useThree((s) => s.size.width / s.size.height);

  useEffect(() => {
    // Below ~2.1 aspect the board would be clipped, so back the camera off
    const distanceScale = Math.max(1, 2.1 / aspect) ** 0.95;
    camera.position.set(0, 12 * distanceScale, 15 * distanceScale);
    camera.lookAt(0, -1.4, 0);
    camera.updateProjectionMatrix();
  }, [aspect, camera]);

  return null;
}

export default function KeyboardScene() {
  const theme = useThemeStore((s) => s.theme);
  const palette = SCENE_PALETTES[theme];

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 30, near: 0.1, far: 200, position: [0, 12, 15] }}
      gl={{
        antialias: false, // the composer handles AA via multisampling
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        powerPreference: "high-performance",
      }}
    >
      <color attach="background" args={["#000000"]} />
      <ResponsiveCamera />

      <Suspense fallback={null}>
        <Lights palette={palette} />

        <PresentationControls
          global
          cursor={false}
          snap
          speed={1.2}
          rotation={[0, -0.08, 0]}
          polar={[-0.25, 0.35]}
          azimuth={[-0.7, 0.7]}
        >
          <Keyboard palette={palette} />
        </PresentationControls>
      </Suspense>

      <EffectComposer multisampling={8}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.75} luminanceSmoothing={0.2} radius={0.7} />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>

      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
