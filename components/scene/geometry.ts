import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Procedural geometry for the ODDLY sculpture family. Every piece is the same
 * kind of thing: one thick, continuous stroke of matte clay. Shapes differ,
 * the material grammar does not. Nothing is downloaded.
 */

export type Quality = "high" | "low";

type Fn = (t: number, out: THREE.Vector3) => THREE.Vector3;

class ParamCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private fn: Fn) {
    super();
  }

  getPoint(u: number, target = new THREE.Vector3()) {
    return this.fn(u, target);
  }
}

const TAU = Math.PI * 2;

/* ---------- Curves ----------
   Each is hand-tuned so it reads as made, not as a textbook knot: lobes are
   uneven and depth varies, so the stroke crosses over itself at real distance. */

/** Coral loop — the signature: a lopsided figure-eight with a tucked third lobe. */
const loop: Fn = (u, o) => {
  const t = u * TAU;
  return o.set(
    1.18 * Math.sin(t) + 0.32 * Math.sin(2 * t) - 0.08 * Math.sin(3 * t),
    1.376 * Math.sin(t) * Math.cos(t) + 0.3 * Math.cos(t) - 0.18 * Math.cos(3 * t),
    0.62 * Math.cos(t) + 0.34 * Math.sin(3 * t),
  );
};

/** Lavender twist — a fat ring bent into a saddle, like a ring of dough that slumped. */
const twist: Fn = (u, o) => {
  const t = u * TAU;
  const r = 1 + 0.07 * Math.sin(3 * t + 0.6);
  return o.set(r * Math.cos(t), 0.9 * r * Math.sin(t), 0.42 * Math.sin(2 * t) + 0.08 * Math.cos(3 * t));
};

/** Sage knot — a trefoil pulled out of true: one lobe fuller, one tighter. */
const knot: Fn = (u, o) => {
  const t = u * TAU;
  const wob = 1 + 0.12 * Math.sin(t + 0.9);
  return o.set(
    wob * (Math.sin(t) + 2 * Math.sin(2 * t)),
    wob * (Math.cos(t) - 2 * Math.cos(2 * t)) * 0.92,
    -Math.sin(3 * t) * 1.1,
  );
};

/** Stone coil — an open stroke that rolls through two loops (a prolate cycloid with depth). */
const coil: Fn = (u, o) => {
  const t = u * 2.25 * TAU;
  return o.set(u * 3.4 - 0.62 * Math.sin(t), 0.68 * Math.cos(t) - u * 0.35, 0.46 * Math.sin(t));
};

/** Scribble — a loose, open loop-de-loop; the fine marks that wrap around the type. */
const scribble: Fn = (u, o) => {
  const t = u * 1.6 * TAU;
  const swell = 0.75 + 0.35 * Math.sin(u * Math.PI);
  return o.set(u * 2.6 - 0.7 * swell * Math.sin(t), 0.72 * swell * Math.cos(t) - u * 0.4, 0.5 * Math.sin(t));
};

export const CURVES = { loop, twist, knot, coil, scribble };
export type CurveName = keyof typeof CURVES;

export type BuiltSculpture = {
  tube: THREE.TubeGeometry;
  /** Positions of end caps (open strokes only), in final units. */
  caps: THREE.Vector3[];
  capGeometry: THREE.SphereGeometry | null;
  /** Distance from centre to the top of the piece (for hanging wires). */
  top: number;
  /** Texture repeat that keeps grain roughly square along the tube. */
  grainRepeat: [number, number];
};

/**
 * Build a tube along a named curve, normalised so its largest dimension is
 * `size` world units with a stroke of radius `radius` in those same units.
 */
export function buildSculpture(
  name: CurveName,
  { size, radius, closed }: { size: number; radius: number; closed: boolean },
  q: Quality,
): BuiltSculpture {
  const curve = new ParamCurve(CURVES[name]);
  const box = new THREE.Box3().setFromPoints(curve.getSpacedPoints(400));
  const dim = box.getSize(new THREE.Vector3());
  const raw = Math.max(dim.x, dim.y, dim.z);
  // Scale so the curve span plus the stroke's own thickness equals `size`.
  const k = (size - 2 * radius) / raw;
  const centre = box.getCenter(new THREE.Vector3());

  const segs = Math.round((q === "high" ? 520 : 220) * (closed ? 1 : 0.7));
  const radial = q === "high" ? 36 : 18;
  const tube = new THREE.TubeGeometry(curve, segs, radius / k, radial, closed);
  tube.translate(-centre.x, -centre.y, -centre.z);
  tube.scale(k, k, k);

  const caps: THREE.Vector3[] = [];
  let capGeometry: THREE.SphereGeometry | null = null;
  if (!closed) {
    capGeometry = new THREE.SphereGeometry(radius, radial, Math.max(8, radial / 2));
    for (const u of [0, 1]) caps.push(curve.getPoint(u).sub(centre).multiplyScalar(k));
  }

  tube.computeBoundingBox();
  const top = tube.boundingBox ? tube.boundingBox.max.y : size / 2;
  const length = curve.getLength() * k;
  const around = TAU * radius;

  return {
    tube,
    caps,
    capGeometry,
    top,
    grainRepeat: [Math.max(1, Math.round(length / around)), 1],
  };
}

/* ---------- Compound pieces ----------
   The project sculptures: several clay strokes fused into one object. Same
   material and stroke grammar as the installation, each with a subject:
   stack (ledger), wave (shoreline), chain (synced records), spring
   (animation), lens (search), rosette (campaign burst). */

type Stroke = { curve: THREE.Curve<THREE.Vector3>; closed: boolean; weight?: number };

const fn = (f: Fn) => new ParamCurve(f);
const path = (pts: Array<[number, number, number]>, closed = false) =>
  new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)), closed, "centripetal");
const ring = (cx: number, cy: number, cz: number, a: number, b: number, plane: "xy" | "xz") =>
  fn((u, o) => {
    const t = u * TAU;
    return plane === "xy"
      ? o.set(cx + a * Math.cos(t), cy + b * Math.sin(t), cz)
      : o.set(cx + a * Math.cos(t), cy, cz + b * Math.sin(t));
  });

export const COMPOUNDS = {
  /** Three thick rings stacked slightly off true, like a ledger of coins. */
  stack: (): Stroke[] => [
    { curve: ring(0, 0, 0, 0.9, 0.9, "xz"), closed: true },
    { curve: ring(0.14, 0.46, 0.04, 0.8, 0.8, "xz"), closed: true },
    { curve: ring(-0.06, 0.9, -0.05, 0.7, 0.7, "xz"), closed: true },
  ],
  /** A rolling stroke that builds into a curling crest. */
  wave: (): Stroke[] => [
    {
      curve: path([
        [-1.9, -0.35, 0.1],
        [-1.25, 0.05, 0.25],
        [-0.6, -0.25, 0],
        [0.05, 0.15, -0.2],
        [0.6, 0.75, -0.05],
        [0.95, 1.25, 0.15],
        [0.75, 1.62, 0.3],
        [0.32, 1.5, 0.25],
        [0.3, 1.1, 0.05],
        [0.62, 1.02, -0.08],
      ]),
      closed: false,
    },
  ],
  /** Three interlocked links: records that stay in step. */
  chain: (): Stroke[] => [
    { curve: ring(-1.3, 0, 0, 0.82, 0.48, "xy"), closed: true },
    { curve: ring(0, 0, 0, 0.82, 0.48, "xz"), closed: true },
    { curve: ring(1.3, 0, 0, 0.82, 0.48, "xy"), closed: true },
  ],
  /** A springing coil, squashed at the base like a bounce caught mid-frame. */
  spring: (): Stroke[] => [
    {
      curve: fn((u, o) => {
        const t = u * 5.5 * TAU;
        const r = 0.62 + 0.14 * Math.sin(u * Math.PI);
        const y = 3.0 * (u * u * 0.35 + u * 0.65) - 1.5;
        return o.set(r * Math.cos(t), y, r * Math.sin(t));
      }),
      closed: false,
    },
  ],
  /** A lens and its handle: looking closely, being found. */
  lens: (): Stroke[] => [
    { curve: ring(0, 0, 0, 0.9, 0.9, "xy"), closed: true },
    {
      curve: path([
        [0.72, -0.72, 0],
        [1.15, -1.18, 0.06],
        [1.62, -1.66, 0],
      ]),
      closed: false,
      weight: 1.45,
    },
  ],
  /** A five-petalled rosette that rises and dips: a burst of attention. */
  rosette: (): Stroke[] => [
    {
      curve: fn((u, o) => {
        const t = u * TAU;
        const r = 1 + 0.34 * Math.sin(5 * t);
        return o.set(r * Math.cos(t), r * Math.sin(t), 0.32 * Math.sin(5 * t + 1.2));
      }),
      closed: true,
    },
  ],
};
export type CompoundName = keyof typeof COMPOUNDS;

/** Build a compound piece: every stroke tubed and capped, then fused into one geometry. */
export function buildCompound(
  name: CompoundName,
  { size, radius }: { size: number; radius: number },
  q: Quality,
): BuiltSculpture {
  const strokes = COMPOUNDS[name]();
  const pts = strokes.flatMap((s) => s.curve.getSpacedPoints(200));
  const box = new THREE.Box3().setFromPoints(pts);
  const dim = box.getSize(new THREE.Vector3());
  const raw = Math.max(dim.x, dim.y, dim.z);
  const k = (size - 2 * radius) / raw;
  const centre = box.getCenter(new THREE.Vector3());
  const radial = q === "high" ? 32 : 16;

  const parts: THREE.BufferGeometry[] = [];
  let length = 0;
  for (const s of strokes) {
    const r = (radius * (s.weight ?? 1)) / k;
    const segs = Math.round((q === "high" ? 260 : 110) * (s.closed ? 1 : 0.7));
    parts.push(new THREE.TubeGeometry(s.curve, segs, r, radial, s.closed));
    length += s.curve.getLength();
    if (!s.closed) {
      for (const u of [0, 1]) {
        const cap = new THREE.SphereGeometry(r, radial, Math.max(8, radial / 2));
        const p = s.curve.getPoint(u);
        cap.translate(p.x, p.y, p.z);
        parts.push(cap);
      }
    }
  }
  const merged = mergeGeometries(parts.map((g) => g.toNonIndexed()), false) as THREE.BufferGeometry;
  parts.forEach((g) => g.dispose());
  merged.translate(-centre.x, -centre.y, -centre.z);
  merged.scale(k, k, k);
  merged.computeBoundingBox();

  return {
    tube: merged as unknown as THREE.TubeGeometry,
    caps: [],
    capGeometry: null,
    top: merged.boundingBox ? merged.boundingBox.max.y : size / 2,
    grainRepeat: [Math.max(1, Math.round((length * k) / (TAU * radius) / strokes.length)), 1],
  };
}

/* ---------- Stage pieces ----------
   The plinth each project piece rests on, and the small brand-kit marks that
   float at different depths around the scene words (the star and asterisk
   from the brand kit, plus small soft ceramic cubes). */

/** A shallow ceramic plinth with a softly rounded edge. */
export function makePlinth(q: Quality) {
  const r = 1.5;
  const h = 0.085;
  const e = 0.075; // edge rounding
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, -h)];
  const steps = q === "high" ? 10 : 5;
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * Math.PI;
    pts.push(new THREE.Vector2(r - e + Math.cos(a) * e, (Math.sin(a) * h)));
  }
  pts.push(new THREE.Vector2(0, h));
  const geo = new THREE.LatheGeometry(pts, q === "high" ? 96 : 48);
  geo.computeVertexNormals();
  return geo;
}

/** The brand kit's four-point star, extruded and bevelled. */
export function makeStar() {
  const shape = new THREE.Shape();
  const tip = 0.5;
  const waist = 0.13;
  shape.moveTo(0, tip);
  shape.quadraticCurveTo(waist, waist, tip, 0);
  shape.quadraticCurveTo(waist, -waist, 0, -tip);
  shape.quadraticCurveTo(-waist, -waist, -tip, 0);
  shape.quadraticCurveTo(-waist, waist, 0, tip);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.035,
    bevelSegments: 6,
    curveSegments: 24,
  });
  geo.center();
  return geo;
}

/** The brand kit's asterisk: three rounded bars crossed at 60°. */
export function makeAsterisk() {
  const bars = [0, 1, 2].map((i) => {
    const g = new THREE.CapsuleGeometry(0.075, 0.62, 8, 16);
    g.rotateZ((i * Math.PI) / 3);
    return g.toNonIndexed();
  });
  const merged = mergeGeometries(bars, false) as THREE.BufferGeometry;
  bars.forEach((b) => b.dispose());
  return merged;
}

/** A small soft-edged ceramic cube: the neutral filler between the brand marks. */
export function makeCube() {
  return new RoundedBoxGeometry(0.34, 0.34, 0.34, 4, 0.07);
}

/* ---------- Surface ----------
   Two seeded canvas textures give the clay its life:
   - speckle: a near-white field with sparse dark flecks, multiplied into the colour
   - grain:   fine pitting for the bump map
   Generated once; the page downloads no images for the 3D. */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

export function makeSpeckleTexture(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  const rand = seeded(11);
  const flecks = Math.round(size * size * 0.01);
  for (let i = 0; i < flecks; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 0.35 + rand() * (rand() > 0.94 ? 1.3 : 0.55);
    const v = Math.round(120 + rand() * 90);
    ctx.fillStyle = `rgb(${v},${v - 4},${v - 8})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function makeGrainTexture(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const img = ctx.createImageData(size, size);
  const rand = seeded(7);
  for (let i = 0; i < size * size; i++) {
    const r = rand();
    const v = r > 0.955 ? 60 + rand() * 60 : 168 + rand() * 50;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  ctx.globalAlpha = 0.55;
  ctx.filter = "blur(0.7px)";
  ctx.drawImage(canvas, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 8;
  return tex;
}
