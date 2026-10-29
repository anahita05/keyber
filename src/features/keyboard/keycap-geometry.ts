import { BufferGeometry } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Keycap dimensions in world units (1 world unit = 1u key pitch).
 */
export const KEYCAP = {
  /** Footprint of a 1u cap (pitch minus the gap between caps) */
  bottomSize: 0.9,
  height: 0.5,
  /** Top surface is this fraction of the bottom (the tapered "pyramid" look) */
  taper: 0.78,
  /** Front edge of the top is pulled back a little, like a real sculpted cap */
  topShiftZ: -0.04,
  /** Depth of the concave dish on the top surface */
  dish: 0.035,
  radius: 0.075,
  segments: 5,
} as const;

const cache = new Map<number, BufferGeometry>();

/**
 * Builds a tapered, rounded keycap with a soft concave dish on top.
 * Geometries are cached per width, so a full keyboard only creates
 * a handful of unique meshes.
 */
export function getKeycapGeometry(widthUnits: number): BufferGeometry {
  const cached = cache.get(widthUnits);
  if (cached) return cached;

  const { bottomSize, height, taper, topShiftZ, dish, radius, segments } =
    KEYCAP;

  const width = widthUnits - (1 - bottomSize);
  const depth = bottomSize;

  const geometry = new RoundedBoxGeometry(width, height, depth, segments, radius);
  const pos = geometry.attributes.position;

  const halfW = width / 2;
  const halfD = depth / 2;
  const halfH = height / 2;

  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    // 0 at the bottom, 1 at the top
    const t = (y + halfH) / height;
    // ease so the walls bow slightly outward — reads more like molded glass
    const eased = t * t * (3 - 2 * t);

    // Taper: shrink the absolute amount (not a ratio) so wide keys
    // keep the same wall angle as 1u keys.
    const inset = (1 - taper) * bottomSize * 0.5 * eased;
    x = Math.sign(x) * Math.max(Math.abs(x) - inset * (Math.abs(x) / halfW), 0);
    z = Math.sign(z) * Math.max(Math.abs(z) - inset * (Math.abs(z) / halfD), 0);
    z += topShiftZ * eased;

    // Concave dish on the top face (spherical falloff from the center)
    if (t > 0.92) {
      const topHalfW = halfW - (1 - taper) * bottomSize * 0.5;
      const topHalfD = halfD - (1 - taper) * bottomSize * 0.5;
      const nx = x / Math.max(topHalfW, 0.001);
      const nz = (z - topShiftZ) / Math.max(topHalfD, 0.001);
      const r2 = Math.min(nx * nx * 0.6 + nz * nz, 1);
      const weight = (t - 0.92) / 0.08;
      y -= dish * (1 - r2) * weight;
    }

    pos.setXYZ(i, x, y, z);
  }

  // Sit the cap on y = 0
  geometry.translate(0, halfH, 0);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  cache.set(widthUnits, geometry);
  return geometry;
}

/** Height of the top surface's center (bottom of the dish). */
export const KEYCAP_TOP_Y = KEYCAP.height - KEYCAP.dish;
