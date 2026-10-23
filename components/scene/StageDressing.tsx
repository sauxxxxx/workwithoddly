"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CAMERA } from "./choreography";
import { sceneIdAt, track } from "./track";
import { activeDescent } from "./descent";
import { makeAsterisk, makeCube, makeStar, type Quality } from "./geometry";
import { makeFinish, type Finish } from "./materials";
import { buildPlinth } from "./objects";

/**
 * Project-scene dressing: ODDLY's frosted squircle plinth that every project
 * object rests on, and a few brand-kit marks (star, asterisk, cube) in chrome
 * and frosted glass at different depths around the word. It fades in only
 * while a project scene ("p-…" or "case-…") holds.
 */

const HALF_FOV = Math.tan(THREE.MathUtils.degToRad(CAMERA.fov / 2));
const halfH = (z: number) => HALF_FOV * (CAMERA.z - z);

/** Where the plinth sits (screen fractions). Project poses rest their object on it. */
export const PLINTH = { x: 0, y: -0.5, z: 0.9, tilt: 0.24, s: 0.78 };

type Floater = {
  kind: "star" | "asterisk" | "cube";
  x: number;
  y: number;
  z: number;
  s: number;
  spin: [number, number, number];
  finish: Finish;
};

/* Five accents, placed so they frame the word and never cross the centre column. */
const FLOATERS: Floater[] = [
  { kind: "cube", x: -0.74, y: 0.5, z: 0.6, s: 1.1, spin: [0.2, 0.4, 0.1], finish: { kind: "chrome" } },
  { kind: "star", x: 0.7, y: 0.62, z: 1.2, s: 0.95, spin: [0.2, 0.5, 0.15], finish: { kind: "frosted", colour: "#F6F4FC" } },
  { kind: "asterisk", x: -0.86, y: -0.2, z: 1.6, s: 0.75, spin: [0.15, 0.25, 0.3], finish: { kind: "chrome" } },
  { kind: "cube", x: 0.88, y: -0.12, z: -0.4, s: 0.8, spin: [0.3, 0.2, 0.2], finish: { kind: "frosted", colour: "#F6F4FC" } },
  { kind: "star", x: 0.46, y: 0.92, z: -1.4, s: 0.6, spin: [0.2, 0.3, 0.2], finish: { kind: "chrome" } },
];

const isStage = (id: string) => (id.startsWith("p-") || id.startsWith("case-") || id.startsWith("svc-") ? 1 : 0);

export function StageDressing({
  quality,
  enabled,
  shadows,
  compact,
}: {
  quality: Quality;
  enabled: boolean;
  shadows: boolean;
  compact: boolean;
}) {
  const { size } = useThree();
  const res = useMemo(() => {
    const lite = quality !== "high";
    const geos = { star: makeStar(), asterisk: makeAsterisk(), cube: makeCube() };
    const mats = FLOATERS.map((f) => makeFinish(f.finish, lite));
    const plinth = buildPlinth(quality, lite);
    plinth.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.receiveShadow = shadows;
    });
    return { geos, mats, plinth };
  }, [quality, shadows]);

  useEffect(
    () => () => {
      Object.values(res.geos).forEach((g) => g.dispose());
      res.mats.forEach((m) => m.dispose());
      res.plinth.dispose();
    },
    [res],
  );

  const plinth = useRef<THREE.Group>(null);
  const floaters = useRef<Array<THREE.Mesh | null>>([]);
  const weight = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    // On the home page the plinth and marks ride the project scene on stage
    // (descent.ts); elsewhere (case studies, services) they settle by weight.
    const descent = enabled ? activeDescent() : null;
    const riding = descent?.id.startsWith("p-") ? descent : null;
    const target = descent
      ? riding ? 1 : 0
      : enabled ? isStage(sceneIdAt(track.from)) * (1 - track.t) + isStage(sceneIdAt(track.to)) * track.t : 0;
    weight.current = descent ? target : weight.current + (target - weight.current) * (1 - Math.exp(-6 * dt));
    const w = weight.current;
    const ride = riding ? -2 * riding.offset : 0;
    const grow = riding ? riding.grow : 1;
    const aspect = size.width / size.height;
    const time = state.clock.elapsedTime;

    const p = plinth.current;
    if (p) {
      const hh = halfH(PLINTH.z);
      const py = compact ? -0.16 : PLINTH.y;
      // Off the home stage the plinth rises into place by weight.
      const rise = descent ? 0 : (1 - w) * 0.9;
      p.position.set(PLINTH.x * hh * aspect, (py - rise + ride) * hh, PLINTH.z);
      p.rotation.set(PLINTH.tilt, Math.sin(time * 0.2) * 0.05, 0);
      p.scale.setScalar(PLINTH.s * (compact ? 0.55 : 1) * (hh / halfH(0)) * grow);
      p.visible = w > 0.01;
    }

    FLOATERS.forEach((f, i) => {
      const m = floaters.current[i];
      if (!m) return;
      const hh = halfH(f.z);
      const x = compact ? f.x * 0.9 : f.x;
      // The marks ride with the scene, nearer ones a touch faster (parallax).
      const depth = 0.85 + ((f.z + 2) / 4) * 0.3;
      m.position.set(x * hh * aspect, (f.y + ride * depth) * hh + Math.sin(time * 0.45 + i * 1.3) * 0.08, f.z);
      m.rotation.set(time * f.spin[0] * 0.35 + i, time * f.spin[1] * 0.35, time * f.spin[2] * 0.35);
      m.scale.setScalar(f.s * w * (compact ? 0.55 : 1));
      m.visible = w > 0.01 && (!compact || i < 3);
    });
  });

  return (
    <>
      <group ref={plinth} visible={false}>
        <primitive object={res.plinth.group} />
      </group>
      {FLOATERS.map((f, i) => (
        <mesh
          key={i}
          ref={(m: THREE.Mesh | null) => {
            floaters.current[i] = m;
          }}
          geometry={res.geos[f.kind]}
          material={res.mats[i]}
          castShadow={shadows}
          visible={false}
        />
      ))}
    </>
  );
}
