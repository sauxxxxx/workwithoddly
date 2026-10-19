"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CAMERA } from "./choreography";
import { sceneIdAt, track } from "./track";
import { makeAsterisk, makeCube, makePlinth, makeStar, type Quality } from "./geometry";

/**
 * Project-scene dressing: a glazed plinth the featured piece rests on, and a
 * scatter of small brand-kit marks (star, asterisk, soft ceramic cubes) floating at
 * different depths around the word. Everything fades in only while a project
 * scene ("p-…") holds, so the opening and the studio stay as they are.
 */

const HALF_FOV = Math.tan(THREE.MathUtils.degToRad(CAMERA.fov / 2));
const halfH = (z: number) => HALF_FOV * (CAMERA.z - z);

/** Where the featured piece sits in a project scene (screen fractions), shared with the poses. */
export const PLINTH = { x: 0, y: -0.58, z: 0.9, tilt: 0.3, s: 0.82 };

type Floater = { kind: "star" | "asterisk" | "cube"; x: number; y: number; z: number; s: number; spin: [number, number, number]; drift: number; colour: string };

/* Hand-placed so the marks frame the word without crossing the centre line. */
const FLOATERS: Floater[] = [
  { kind: "cube", x: -0.86, y: 0.62, z: -0.6, s: 0.9, spin: [0.2, 0.5, 0.1], drift: 0.22, colour: "#F3EEE6" },
  { kind: "asterisk", x: -0.62, y: 0.86, z: 1.4, s: 0.7, spin: [0.1, 0.3, 0.4], drift: 0.35, colour: "#D9D3C9" },
  { kind: "star", x: 0.72, y: 0.74, z: 0.8, s: 0.9, spin: [0.3, 0.6, 0.2], drift: 0.3, colour: "#FF7A59" },
  { kind: "cube", x: 0.9, y: 0.18, z: -1.2, s: 1.1, spin: [0.1, 0.3, 0.2], drift: 0.15, colour: "#ECE6DC" },
  { kind: "asterisk", x: -0.92, y: -0.18, z: 0.4, s: 0.55, spin: [0.2, 0.2, 0.5], drift: 0.28, colour: "#1E2638" },
  { kind: "cube", x: -0.5, y: -0.78, z: 2.0, s: 0.6, spin: [0.4, 0.2, 0.3], drift: 0.45, colour: "#F3EEE6" },
  { kind: "star", x: 0.56, y: -0.86, z: 1.8, s: 0.5, spin: [0.2, 0.5, 0.3], drift: 0.5, colour: "#D9D3C9" },
  { kind: "cube", x: 0.34, y: 0.92, z: -1.8, s: 0.8, spin: [0.3, 0.1, 0.2], drift: 0.12, colour: "#ECE6DC" },
  { kind: "asterisk", x: 0.95, y: -0.44, z: 0.2, s: 0.6, spin: [0.3, 0.2, 0.2], drift: 0.25, colour: "#D9D3C9" },
];

const isProject = (id: string) => (id.startsWith("p-") ? 1 : 0);

function glaze(colour: string, map?: THREE.Texture | null) {
  return new THREE.MeshPhysicalMaterial({
    color: colour,
    map: map ?? null,
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.22,
  });
}

export function StageDressing({
  quality,
  speckle,
  enabled,
  shadows,
  compact,
}: {
  compact: boolean;
  quality: Quality;
  speckle: THREE.Texture;
  enabled: boolean;
  shadows: boolean;
}) {
  const { size } = useThree();
  const res = useMemo(() => {
    const geos = { star: makeStar(), asterisk: makeAsterisk(), cube: makeCube() };
    const plinth = makePlinth(quality);
    const mats = FLOATERS.map((f) => glaze(f.colour, speckle));
    return { geos, plinth, plinthMat: glaze("#F1ECE3"), mats };
  }, [quality, speckle]);

  useEffect(
    () => () => {
      Object.values(res.geos).forEach((g) => g.dispose());
      res.plinth.dispose();
      res.plinthMat.dispose();
      res.mats.forEach((m) => m.dispose());
    },
    [res],
  );

  const plinth = useRef<THREE.Mesh>(null);
  const floaters = useRef<Array<THREE.Mesh | null>>([]);
  const weight = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = enabled ? isProject(sceneIdAt(track.from)) * (1 - track.t) + isProject(sceneIdAt(track.to)) * track.t : 0;
    weight.current += (target - weight.current) * (1 - Math.exp(-6 * dt));
    const w = weight.current;
    const aspect = size.width / size.height;
    const time = state.clock.elapsedTime;

    const p = plinth.current;
    if (p) {
      const hh = halfH(PLINTH.z);
      // The plinth rises into place as the scenes begin and sinks away after.
      const py = compact ? -0.2 : PLINTH.y;
      p.position.set(PLINTH.x * hh * aspect, (py - (1 - w) * 0.9) * hh, PLINTH.z);
      p.rotation.set(PLINTH.tilt, 0, 0);
      p.scale.setScalar(PLINTH.s * (compact ? 0.5 : 1) * (hh / halfH(0)));
      p.visible = w > 0.01;
    }

    const vh = track.viewport || 900;
    FLOATERS.forEach((f, i) => {
      const m = floaters.current[i];
      if (!m) return;
      const hh = halfH(f.z);
      // Each mark drifts upward with the scroll at a rate set by its depth.
      const scrollShift = ((track.scroll / vh) * f.drift) % 2.6;
      let y = f.y + scrollShift;
      if (y > 1.3) y -= 2.6;
      m.position.set(f.x * hh * aspect, y * hh + Math.sin(time * 0.5 + i) * 0.05, f.z);
      m.rotation.set(time * f.spin[0] * 0.3 + i, time * f.spin[1] * 0.3, time * f.spin[2] * 0.3);
      m.scale.setScalar(f.s * w * (compact ? 0.6 : 1));
      m.visible = w > 0.01;
    });
  });

  return (
    <>
      <mesh ref={plinth} geometry={res.plinth} material={res.plinthMat} receiveShadow={shadows} castShadow={shadows} visible={false} />
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
