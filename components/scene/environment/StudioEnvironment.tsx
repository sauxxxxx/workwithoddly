"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey } from "../journey";
import { sceneIdAt, track } from "../track";
import { SCULPTURES } from "../sculptures";

/* Colour of the clay piece each project scene features (scene id "p-<piece>"). */
const PIECE_COLOUR = Object.fromEntries(SCULPTURES.map((s) => [s.id, new THREE.Color(s.colour)]));
/* Every scene after the opening sits on the bright paper. */
const sceneWeight = (id: string) => (id === "hero" ? 0 : 1);
const CORAL = new THREE.Color("#FF7A59");
import { fragment, vertex } from "./room-shaders";

function Surface({ reduced }: { reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uJourney: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uPaper: { value: new THREE.Color("#e5ddcb") },
      uCoast: { value: new THREE.Color("#9cb9ae") },
      uTint: { value: new THREE.Color("#ff7a59") },
      uTintAmount: { value: 0 },
      uLift: { value: 0 },
    }),
    [],
  );
  useEffect(() => {
    if (reduced || !matchMedia("(pointer:fine)").matches) return;
    const move = (event: PointerEvent) => {
      pointer.current.tx = (event.clientX / innerWidth) * 2 - 1;
      pointer.current.ty = (event.clientY / innerHeight) * 2 - 1;
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, [reduced]);
  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const p = pointer.current;
    const damping = 1 - Math.exp(-Math.min(delta, 0.05) * 3);
    p.x += (p.tx - p.x) * damping;
    p.y += (p.ty - p.y) * damping;
    u.uPointer.value.set(p.x, p.y);
    u.uTime.value = reduced ? 0 : state.clock.elapsedTime;
    u.uJourney.value +=
      ((reduced ? 0 : journey().light * 0.15) - u.uJourney.value) * damping;

    // Project scenes: lift the paper and pool the featured piece's colour.
    const from = sceneIdAt(track.from);
    const to = sceneIdAt(track.to);
    const weight = sceneWeight(from) * (1 - track.t) + sceneWeight(to) * track.t;
    const focus = track.t > 0.5 ? to : from;
    const colour = focus.startsWith("p-") ? PIECE_COLOUR[focus.slice(2)] : focus === "studio" ? CORAL : undefined;
    if (colour) u.uTint.value.lerp(colour, damping);
    u.uLift.value += (weight - u.uLift.value) * damping;
    u.uTintAmount.value += (weight * 0.38 - u.uTintAmount.value) * damping;
  });
  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[30, 22, 100, 70]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function StudioEnvironment({
  reduced,
  compact,
  onFailure,
}: {
  reduced: boolean;
  compact: boolean;
  onFailure: () => void;
}) {
  return (
    <Canvas
      frameloop={reduced ? "demand" : "always"}
      dpr={compact ? 1 : 1.25}
      camera={{ position: [0, 0, 12], fov: 30 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
        toneMapping: THREE.NeutralToneMapping,
      }}
      onCreated={({ gl }) =>
        gl.domElement.addEventListener("webglcontextlost", onFailure, {
          once: true,
        })
      }
    >
      <Surface reduced={reduced} />
    </Canvas>
  );
}
