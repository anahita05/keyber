"use client";

import { memo, useMemo, useRef, type RefObject } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { MathUtils, type Group, type Material, type Mesh, type MeshBasicMaterial } from "three";
import { getKeycapGeometry, KEYCAP } from "./keycap-geometry";
import type { PlacedKey } from "./layout";

const FONT_URL = "/fonts/inter-500.woff";

interface KeycapProps {
  keyDef: PlacedKey;
  /** Shared glass material (one instance for the whole board) */
  glassRef: RefObject<Material | null>;
  stemMaterial: Material;
  housingMaterial: Material;
}

/** How high a cap rises on hover (world units). */
const HOVER_LIFT = 0.07;

function KeycapComponent({
  keyDef,
  glassRef,
  stemMaterial,
  housingMaterial,
}: KeycapProps) {
  const capRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const legendRef = useRef<MeshBasicMaterial>(null);
  const hovered = useRef(false);

  const geometry = useMemo(() => getKeycapGeometry(keyDef.w), [keyDef.w]);

  const fontSize = keyDef.label.length > 2 ? 0.13 : 0.2;

  useFrame((_, delta) => {
    const cap = capRef.current;
    if (!cap) return;

    // Pick up the shared glass once it exists
    const mesh = meshRef.current;
    if (mesh && glassRef.current && mesh.material !== glassRef.current) {
      mesh.material = glassRef.current;
      mesh.visible = true;
    }

    const target = hovered.current ? HOVER_LIFT : 0;
    cap.position.y = MathUtils.damp(cap.position.y, target, 12, delta);

    if (legendRef.current) {
      const glow = hovered.current ? 2.2 : 1.15;
      const c = legendRef.current.color;
      const v = MathUtils.damp(c.r, glow, 10, delta);
      c.setScalar(v);
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovered.current = true;
    document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    hovered.current = false;
    document.body.style.cursor = "";
  };

  return (
    <group position={[keyDef.x, 0, keyDef.z]}>
      {/* Switch housing + stem, visible through the glass */}
      <mesh material={housingMaterial} position={[0, -0.09, 0]}>
        <boxGeometry args={[0.56, 0.18, 0.56]} />
      </mesh>
      <mesh material={stemMaterial} position={[0, 0.02, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.05]} />
      </mesh>
      <mesh material={stemMaterial} position={[0, 0.02, 0]}>
        <boxGeometry args={[0.05, 0.06, 0.18]} />
      </mesh>

      {/* The glass cap itself */}
      <group ref={capRef}>
        <mesh
          ref={meshRef}
          visible={false}
          geometry={geometry}
          position={[0, 0.06, 0]}
          onPointerOver={onOver}
          onPointerOut={onOut}
        />

        {keyDef.label && (
          <Text
            font={FONT_URL}
            fontSize={fontSize}
            letterSpacing={-0.02}
            anchorX="center"
            anchorY="middle"
            // Sits just above the cap's rim so the curved glass never swallows it
            position={[0, 0.06 + KEYCAP.height + 0.004, KEYCAP.topShiftZ]}
            rotation={[-Math.PI / 2, 0, keyDef.legendRotation ?? 0]}
            raycast={() => null}
          >
            {keyDef.label}
            <meshBasicMaterial ref={legendRef} toneMapped={false} color="#ffffff" />
          </Text>
        )}
      </group>
    </group>
  );
}

export const Keycap = memo(KeycapComponent);
