"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CAMERA } from "./choreography";
import { track } from "./track";

/**
 * The coral ribbon: one continuous clay stroke laid along the page itself, so
 * it scrolls with the document and threads every project scene. It hugs the
 * edges while a scene holds and crosses the frame between scenes, drawing
 * itself just ahead of the reader.
 *
 * Geometry lives in "page space": y is measured from document positions and
 * the whole stroke is offset by the scroll each frame.
 */

const HALF = Math.tan(THREE.MathUtils.degToRad(CAMERA.fov / 2)) * CAMERA.z; // half view height at z = 0
const RADIUS = 0.055;
const RADIAL = 18;

type Built = { geometry: THREE.TubeGeometry; segY: Float32Array; start: number; end: number };

function build(aspect: number, vh: number): Built | null {
  const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-project-scene]"));
  if (scenes.length === 0) return null;
  const sy = window.scrollY;
  const doc = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + sy, h: r.height };
  };
  const pts: Array<[number, number, number]> = []; // x (fraction of half-width), y (doc px), z
  const first = doc(scenes[0]);
  pts.push([1.25, first.top - vh * 0.2, 0.2]);
  scenes.forEach((el, i) => {
    const { top, h } = doc(el);
    const side = i % 2 === 0 ? 1 : -1;
    // Enter crossing the frame high, then hug the edge while the scene holds.
    pts.push([side * -0.35, top + vh * 0.1, 0.4]);
    pts.push([side * -0.99, top + h * 0.35, -0.2]);
    pts.push([side * -1.02, top + h * 0.62, 0.1]);
    pts.push([side * -0.5, top + h * 0.86, 0.5]);
  });
  const last = doc(scenes[scenes.length - 1]);
  // Leave off the right edge as the last scene releases, before the studio.
  pts.push([0.55, last.top + last.h - vh * 0.02, 0.3]);
  pts.push([1.35, last.top + last.h + vh * 0.12, 0.1]);

  const hw = HALF * aspect;
  const toWorld = ([x, y, z]: [number, number, number]) =>
    new THREE.Vector3(x * hw, HALF - (y / vh) * 2 * HALF, z);
  const curve = new THREE.CatmullRomCurve3(pts.map(toWorld), false, "centripetal", 0.5);
  const segments = Math.min(1600, Math.max(300, Math.round(pts.length * 60)));
  const geometry = new THREE.TubeGeometry(curve, segments, RADIUS, RADIAL, false);

  // Document y of each tubular segment, for drawing up to the reader.
  const segY = new Float32Array(segments + 1);
  for (let i = 0; i <= segments; i++) {
    const p = curve.getPointAt(i / segments);
    segY[i] = ((HALF - p.y) / (2 * HALF)) * vh;
  }
  return { geometry, segY, start: pts[0][1], end: pts[pts.length - 1][1] };
}

export function Ribbon({ material, enabled }: { material: THREE.Material; enabled: boolean }) {
  const { size } = useThree();
  const mesh = useRef<THREE.Mesh>(null);
  const built = useRef<Built | null>(null);
  const version = useRef(-1);
  const drawn = useRef(0);
  const placeholder = useMemo(() => new THREE.BufferGeometry(), []);

  useEffect(
    () => () => {
      built.current?.geometry.dispose();
      placeholder.dispose();
    },
    [placeholder],
  );

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const vh = track.viewport || window.innerHeight;
    if (!enabled) {
      m.visible = false;
      return;
    }
    // Rebuild whenever the scroll markers are re-measured (resize, fonts, route).
    if (version.current !== track.version) {
      version.current = track.version;
      built.current?.geometry.dispose();
      built.current = build(size.width / size.height, vh);
      m.geometry = built.current?.geometry ?? placeholder;
      drawn.current = 0;
    }
    const b = built.current;
    if (!b) {
      m.visible = false;
      return;
    }
    // Scroll the stroke with the page.
    m.position.y = (track.scroll / vh) * 2 * HALF;

    // Draw up to just below the bottom of the viewport.
    const reach = track.scroll + vh * 0.92;
    let n = 0;
    const seg = b.segY;
    while (n < seg.length - 1 && seg[n] < reach) n++;
    drawn.current += (n - drawn.current) * (1 - Math.exp(-8 * Math.min(delta, 0.05)));
    const segs = Math.floor(drawn.current);
    const index = b.geometry.index;
    if (index) b.geometry.setDrawRange(0, segs * RADIAL * 6);
    const onScreen = track.scroll + vh > b.start && track.scroll < b.end + vh;
    m.visible = segs > 0 && onScreen;
  });

  return <mesh ref={mesh} geometry={placeholder} material={material} castShadow receiveShadow frustumCulled={false} />;
}
