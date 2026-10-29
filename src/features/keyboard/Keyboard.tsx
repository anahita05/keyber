"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox, useFBO } from "@react-three/drei";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NoToneMapping,
  type Group,
  type Material,
} from "three";
import { Keycap } from "./Keycap";
import { placeKeys } from "./layout";
import type { ScenePalette } from "./palette";

function createHaloTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.45, "rgba(255,255,255,0.25)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/**
 * One shared "what's behind the glass" render for *all* keycaps.
 *
 * drei's MeshTransmissionMaterial normally renders the scene once per
 * material instance — 80+ times a frame for a keyboard. Instead we render
 * once into `buffer` with the keycaps hidden and the colourful
 * environment map as the background, then every cap samples that same
 * texture. The page stays pure black, but the glass is full of colour.
 */
function useGlassBuffer(glassRef: RefObject<Material | null>) {
  const buffer = useFBO();

  useFrame((state) => {
    const glass = glassRef.current;
    if (!glass) return;
    const { gl, scene, camera } = state;
    const prevBackground = scene.background;
    const prevToneMapping = gl.toneMapping;

    glass.visible = false;
    // Tone mapping happens once, in the final render — not here as well
    gl.toneMapping = NoToneMapping;
    scene.background = scene.environment;
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    scene.background = prevBackground;
    gl.toneMapping = prevToneMapping;
    glass.visible = true;
  });

  return buffer;
}

export function Keyboard({ palette }: { palette: ScenePalette }) {
  const groupRef = useRef<Group>(null);
  const { keys, width, depth } = useMemo(() => placeKeys(), []);

  // The glass material is created declaratively below (on a hidden carrier
  // mesh) and then shared by every keycap through this ref.
  const glassRef = useRef<Material | null>(null);
  const buffer = useGlassBuffer(glassRef);

  const materials = useMemo(
    () => ({
      housing: new MeshStandardMaterial({
        color: "#0b0b0e",
        roughness: 0.35,
        metalness: 0.2,
      }),
      stem: new MeshStandardMaterial({
        color: "#000000",
        emissiveIntensity: 0.55,
        roughness: 0.4,
        toneMapped: false,
      }),
      plate: new MeshPhysicalMaterial({
        color: "#050507",
        roughness: 0.22,
        metalness: 0.6,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 0.9,
      }),
    }),
    []
  );

  // Theme-dependent colors are updated in place — no material rebuilds
  useEffect(() => {
    materials.stem.emissive.set(palette.stem);
  }, [materials, palette]);

  useEffect(
    () => () => {
      Object.values(materials).forEach((m) => m.dispose());
    },
    [materials]
  );

  const haloTexture = useMemo(() => createHaloTexture(), []);

  // A slow, weightless float
  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const t = clock.getElapsedTime();
    g.position.y = Math.sin(t * 0.6) * 0.08;
    g.rotation.z = Math.sin(t * 0.4) * 0.012;
  });

  const caseW = width + 0.55;
  const caseD = depth + 0.55;

  return (
    <group ref={groupRef}>
      {/* Carrier for the shared glass material — never rendered itself */}
      <mesh visible={false}>
        <MeshTransmissionMaterial
          ref={(m) => {
            glassRef.current = m as unknown as Material | null;
          }}
          buffer={buffer.texture}
          color="#ffffff"
          transmission={1}
          thickness={0.6}
          roughness={0.04}
          ior={1.5}
          chromaticAberration={0.9}
          anisotropicBlur={0.15}
          distortion={0.35}
          distortionScale={0.45}
          temporalDistortion={0.06}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[120, 900]}
          clearcoat={1}
          clearcoatRoughness={0.03}
          envMapIntensity={2.4}
          attenuationColor="#ffffff"
          attenuationDistance={3}
          samples={6}
        />
      </mesh>

      {/* Case */}
      <RoundedBox
        args={[caseW, 0.42, caseD]}
        radius={0.18}
        smoothness={6}
        position={[0, -0.33, 0]}
        material={materials.plate}
      />

      {keys.map((k) => (
        <Keycap
          key={k.code + k.x}
          keyDef={k}
          glassRef={glassRef}
          stemMaterial={materials.stem}
          housingMaterial={materials.housing}
        />
      ))}

      {/* Soft colored halo below the board */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
        <planeGeometry args={[caseW * 1.6, caseD * 2.6]} />
        <meshBasicMaterial
          map={haloTexture}
          color={palette.halo}
          transparent
          opacity={0.35}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
