import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { makeFinish, type Finish } from "./materials";
import type { Quality } from "./geometry";

/**
 * The project objects: one designed object per project, built in code from
 * polished metal, lacquer and glass. Each builder works in its own units; the
 * result is centred and scaled so its largest dimension equals `size`.
 *
 *   coins      — Joyno Accounting (SOFTWARE): a stack of gold coins
 *   wave       — Shark's Tail (HOSPITALITY): a glass wave crest
 *   sync       — JoynoSync (WORKFLOW): two interlocking sync arrows
 *   clapper    — CasaToon (ANIMATION): a clapperboard, arm open
 *   magnifier  — NxOne DC (SEARCH): chrome magnifier, glass lens
 *   megaphone  — Marketing & Content (CAMPAIGNS): lacquered megaphone
 */

export type ObjectName = "coins" | "wave" | "sync" | "clapper" | "magnifier" | "megaphone";

type Ctx = { q: Quality; mat: (f: Finish) => THREE.Material };

const CORAL = "#FF7A59";
const LAVENDER = "#A78BFA";
const CHARCOAL = "#1B2236";

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/* ---------- Coins ---------- */
function coinGeometry(q: Quality) {
  // Profile of a minted coin: raised rim, recessed field, raised centre ring.
  const r = 1;
  const t = 0.15;
  const p: Array<[number, number]> = [
    [0, -t],
    [r - 0.02, -t],
    [r, -t + 0.02],
    [r, t - 0.02],
    [r - 0.02, t],
    [r - 0.13, t],
    [r - 0.16, t - 0.045],
    [0.52, t - 0.045],
    [0.5, t - 0.01],
    [0.42, t - 0.01],
    [0.4, t - 0.045],
    [0, t - 0.045],
  ];
  return new THREE.LatheGeometry(
    p.map(([x, y]) => new THREE.Vector2(x, y)),
    q === "high" ? 96 : 48,
  );
}

function coins(c: Ctx) {
  const g = new THREE.Group();
  const geo = coinGeometry(c.q);
  const gold = c.mat({ kind: "gold" });
  const offsets: Array<[number, number, number]> = [
    [0, 0, 0],
    [0.06, 0.3, 0.04],
    [-0.05, 0.6, -0.03],
    [0.08, 0.9, 0.02],
  ];
  offsets.forEach(([x, y, z], i) => {
    const m = mesh(geo, gold);
    m.position.set(x, y, z);
    m.rotation.y = i * 0.7;
    g.add(m);
  });
  // The top coin leans against the stack, catching the light on its face.
  const top = mesh(geo, gold);
  top.position.set(0.55, 1.55, 0.25);
  top.rotation.set(1.05, 0.2, -0.35);
  g.add(top);
  return g;
}

/* ---------- Wave ---------- */
function wave(c: Ctx) {
  const s = new THREE.Shape();
  s.moveTo(-2.2, 0);
  s.lineTo(1.5, 0);
  s.bezierCurveTo(1.85, 0.5, 1.75, 1.35, 1.25, 1.85);
  s.bezierCurveTo(0.8, 2.25, 0.1, 2.2, -0.1, 1.85);
  s.bezierCurveTo(-0.22, 1.6, 0.05, 1.35, 0.4, 1.45);
  s.bezierCurveTo(0.6, 1.5, 0.75, 1.3, 0.62, 1.0);
  s.bezierCurveTo(0.35, 0.45, -0.9, 0.25, -2.2, 0.22);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.9,
    bevelEnabled: true,
    bevelThickness: 0.18,
    bevelSize: 0.14,
    bevelSegments: c.q === "high" ? 10 : 4,
    curveSegments: c.q === "high" ? 48 : 20,
  });
  geo.translate(0, 0, -0.45);
  const g = new THREE.Group();
  g.add(mesh(geo, c.mat({ kind: "glass", colour: "#6FD0D3", opacity: 0.7 })));
  // Chrome droplets thrown off the crest.
  const drop = new THREE.SphereGeometry(1, 24, 16);
  const chrome = c.mat({ kind: "chrome" });
  for (const [x, y, z, r] of [
    [1.75, 2.15, 0.2, 0.12],
    [2.05, 1.85, -0.1, 0.08],
    [1.5, 2.45, 0.05, 0.07],
  ] as const) {
    const m = mesh(drop, chrome);
    m.position.set(x, y, z);
    m.scale.setScalar(r);
    g.add(m);
  }
  return g;
}

/* ---------- Sync arrows ---------- */
function arrow(c: Ctx, finish: Finish) {
  const g = new THREE.Group();
  const mat = c.mat(finish);
  const arc = Math.PI * 1.45;
  const body = mesh(new THREE.TorusGeometry(1, 0.17, c.q === "high" ? 24 : 12, c.q === "high" ? 96 : 48, arc), mat);
  g.add(body);
  const head = mesh(new THREE.ConeGeometry(0.36, 0.62, c.q === "high" ? 32 : 16), mat);
  // At the end of the arc, pointing along the tangent.
  head.position.set(Math.cos(arc), Math.sin(arc), 0);
  head.rotation.z = arc;
  g.add(head);
  const tail = mesh(new THREE.SphereGeometry(0.17, 24, 16), mat);
  tail.position.set(1, 0, 0);
  g.add(tail);
  return g;
}

function sync(c: Ctx) {
  const g = new THREE.Group();
  const a = arrow(c, { kind: "chrome" });
  const b = arrow(c, { kind: "glass", colour: LAVENDER, opacity: 0.72 });
  b.rotation.z = Math.PI;
  b.position.z = 0.32;
  a.position.z = -0.12;
  g.add(a, b);
  return g;
}

/* ---------- Clapperboard ---------- */
function stripeTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 64;
  const x = c.getContext("2d") as CanvasRenderingContext2D;
  x.fillStyle = "#F8F6EF";
  x.fillRect(0, 0, 512, 64);
  x.fillStyle = CHARCOAL;
  for (let i = -2; i < 10; i++) {
    x.beginPath();
    x.moveTo(i * 64, 64);
    x.lineTo(i * 64 + 32, 64);
    x.lineTo(i * 64 + 64, 0);
    x.lineTo(i * 64 + 32, 0);
    x.closePath();
    x.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function clapper(c: Ctx) {
  const g = new THREE.Group();
  const seg = c.q === "high" ? 6 : 3;
  const body = mesh(new RoundedBoxGeometry(2.4, 1.6, 0.22, seg, 0.07), c.mat({ kind: "lacquer", colour: CORAL }));
  g.add(body);
  const stripes = stripeTexture();
  const stripeMat = new THREE.MeshPhysicalMaterial({ map: stripes, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.06 });
  // Fixed striped band on the body…
  const band = mesh(new RoundedBoxGeometry(2.4, 0.34, 0.24, seg, 0.05), stripeMat);
  band.position.y = 0.97;
  g.add(band);
  // …and the open arm, hinged at the left.
  const arm = new THREE.Group();
  const armBar = mesh(new RoundedBoxGeometry(2.4, 0.34, 0.24, seg, 0.05), stripeMat);
  armBar.position.x = 1.2;
  arm.add(armBar);
  arm.position.set(-1.2, 1.2, 0);
  arm.rotation.z = 0.42;
  g.add(arm);
  const hinge = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.32, 24), c.mat({ kind: "chrome" }));
  hinge.rotation.x = Math.PI / 2;
  hinge.position.set(-1.12, 1.15, 0);
  g.add(hinge);
  return g;
}

/* ---------- Magnifier ---------- */
function magnifier(c: Ctx) {
  const g = new THREE.Group();
  const chrome = c.mat({ kind: "chrome" });
  const ring = mesh(new THREE.TorusGeometry(1, 0.14, c.q === "high" ? 24 : 12, c.q === "high" ? 96 : 48), chrome);
  g.add(ring);
  const lens = mesh(new THREE.CylinderGeometry(0.93, 0.93, 0.08, c.q === "high" ? 64 : 32), c.mat({ kind: "glass", colour: "#EAF2FF", opacity: 0.38 }));
  lens.rotation.x = Math.PI / 2;
  g.add(lens);
  const handle = new THREE.Group();
  const neck = mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.45, 24), chrome);
  neck.position.y = -0.25;
  handle.add(neck);
  const grip = mesh(new THREE.CapsuleGeometry(0.17, 0.95, 8, 24), c.mat({ kind: "lacquer", colour: CHARCOAL }));
  grip.position.y = -0.95;
  handle.add(grip);
  handle.position.set(Math.cos(-Math.PI / 4) * 1.12, Math.sin(-Math.PI / 4) * 1.12, 0);
  handle.rotation.z = Math.PI / 4;
  g.add(handle);
  return g;
}

/* ---------- Megaphone ---------- */
function megaphone(c: Ctx) {
  const g = new THREE.Group();
  const seg = c.q === "high" ? 64 : 32;
  const profile = [
    [0.18, -1.3],
    [0.24, -1.2],
    [0.36, -0.6],
    [0.62, 0.1],
    [1.05, 0.75],
    [1.12, 0.82],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const bellMat = c.mat({ kind: "lacquer", colour: CORAL }) as THREE.MeshPhysicalMaterial;
  bellMat.side = THREE.DoubleSide;
  g.add(mesh(new THREE.LatheGeometry(profile, seg), bellMat));
  const chrome = c.mat({ kind: "chrome" });
  const rim = mesh(new THREE.TorusGeometry(1.12, 0.07, 16, seg), chrome);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.82;
  g.add(rim);
  const mouth = mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.3, 32), chrome);
  mouth.position.y = -1.42;
  g.add(mouth);
  const grip = mesh(new THREE.CapsuleGeometry(0.13, 0.55, 8, 24), c.mat({ kind: "lacquer", colour: CHARCOAL }));
  grip.position.set(0.42, -0.85, 0);
  grip.rotation.z = -0.35;
  g.add(grip);
  // Lay it on its side, bell up and to the right.
  g.rotation.z = -1.05;
  const wrap = new THREE.Group();
  wrap.add(g);
  return wrap;
}

const BUILDERS: Record<ObjectName, (c: Ctx) => THREE.Group> = { coins, wave, sync, clapper, magnifier, megaphone };

export type BuiltObject = { group: THREE.Group; top: number; dispose: () => void };

/** Build, centre and scale a project object so its largest dimension is `size`. */
export function buildObject(name: ObjectName, size: number, q: Quality, lite: boolean): BuiltObject {
  const materials: THREE.Material[] = [];
  const mat = (f: Finish) => {
    const m = makeFinish(f, lite);
    materials.push(m);
    return m;
  };
  const inner = BUILDERS[name]({ q, mat });
  inner.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(inner);
  const dim = box.getSize(new THREE.Vector3());
  const k = size / Math.max(dim.x, dim.y, dim.z);
  const centre = box.getCenter(new THREE.Vector3());
  inner.position.sub(centre);
  const group = new THREE.Group();
  group.add(inner);
  group.scale.setScalar(k);
  const outer = new THREE.Group();
  outer.add(group);

  return {
    group: outer,
    top: (dim.y / 2) * k,
    dispose: () => {
      outer.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const m = o as THREE.Mesh;
          m.geometry.dispose();
          const mm = m.material as THREE.MeshPhysicalMaterial;
          mm.map?.dispose();
        }
      });
      materials.forEach((m) => m.dispose());
    },
  };
}

/** ODDLY's own plinth: a shallow frosted squircle (the app-icon shape) on a chrome base line. */
export function buildPlinth(q: Quality, lite: boolean): BuiltObject {
  const w = 3.2;
  const r = 0.85;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -w / 2);
  s.lineTo(w / 2 - r, -w / 2);
  s.quadraticCurveTo(w / 2, -w / 2, w / 2, -w / 2 + r);
  s.lineTo(w / 2, w / 2 - r);
  s.quadraticCurveTo(w / 2, w / 2, w / 2 - r, w / 2);
  s.lineTo(-w / 2 + r, w / 2);
  s.quadraticCurveTo(-w / 2, w / 2, -w / 2, w / 2 - r);
  s.lineTo(-w / 2, -w / 2 + r);
  s.quadraticCurveTo(-w / 2, -w / 2, -w / 2 + r, -w / 2);
  const opts = (d: number, b: number) => ({
    depth: d,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: q === "high" ? 6 : 3,
    curveSegments: q === "high" ? 32 : 14,
  });
  const top = new THREE.ExtrudeGeometry(s, opts(0.16, 0.05));
  top.rotateX(-Math.PI / 2);
  const base = new THREE.ExtrudeGeometry(s, opts(0.05, 0.02));
  base.rotateX(-Math.PI / 2);
  base.scale(1.02, 1, 1.02);
  base.translate(0, -0.08, 0);
  const frosted = makeFinish({ kind: "frosted", colour: "#F6F4FC" }, lite);
  const chrome = makeFinish({ kind: "chrome" }, lite);
  const g = new THREE.Group();
  const a = new THREE.Mesh(top, frosted);
  a.receiveShadow = true;
  const b = new THREE.Mesh(base, chrome);
  g.add(a, b);
  return {
    group: g,
    top: 0.21,
    dispose: () => {
      top.dispose();
      base.dispose();
      frosted.dispose();
      chrome.dispose();
    },
  };
}
