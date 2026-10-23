"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { CAMERA, DAMPING, OBJECT_IDS, choreography, type ObjectId, type Pose, type Scene } from "./choreography";
import { HANGERS, LINKS, SCULPTURES } from "./sculptures";
import { sceneIdAt, sceneProgress, track } from "./track";
import { buildCompound, buildSculpture, type Quality } from "./geometry";
import { makeFinish } from "./materials";
import { buildObject } from "./objects";
import { journey, range } from "./journey";
import { activeDescent, isDescent } from "./descent";
import { StageDressing } from "./StageDressing";
import { ModelPiece } from "./ModelPiece";

type Props = {
  quality: Quality;
  compact: boolean;
  reducedMotion: boolean;
  onFirstFrame: () => void;
};

type Wire = THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial>;
type Live = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number };

const CHARCOAL = "#0F172A";
const UP = new THREE.Vector3(0, 1, 0);
const WIRE_RADIUS = 0.0085; // ≈ 1.2px on a 900px-tall view

const HALF_FOV = Math.tan(THREE.MathUtils.degToRad(CAMERA.fov / 2));
const halfH = (z: number) => HALF_FOV * (CAMERA.z - z);
const H0 = halfH(0);

/* Stretch a unit cylinder between two points: a hairline with real depth. */
function span(w: Wire, a: THREE.Vector3, b: THREE.Vector3, dir: THREE.Vector3) {
  dir.subVectors(b, a);
  const len = dir.length();
  w.position.copy(a).addScaledVector(dir, 0.5);
  w.scale.set(1, Math.max(len, 0.0001), 1);
  w.quaternion.setFromUnitVectors(UP, dir.normalize());
}

/* A pose entirely outside the frame. */
const offscreen = (p: { x: number; y: number }) => Math.abs(p.x) > 1.2 || Math.abs(p.y) > 1.2;

const toLive = (p: Pose): Live => ({ x: p.x, y: p.y, z: p.z, rx: p.r[0], ry: p.r[1], rz: p.r[2], s: p.s });

export function Installation({ quality, compact, reducedMotion, onFirstFrame }: Props) {
  const { size } = useThree();
  const shadows = quality === "high";

  /* ----- resources: polished strokes and designed objects ----- */
  const res = useMemo(() => {
    const lite = quality !== "high";
    const pieces = SCULPTURES.map((spec) => {
      if (spec.object) {
        const obj = buildObject(spec.object, spec.size, quality, lite);
        obj.group.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            o.castShadow = shadows;
            o.receiveShadow = shadows;
          }
        });
        return { spec, obj, built: null, material: null };
      }
      const built = spec.compound
        ? buildCompound(spec.compound, spec, quality)
        : buildSculpture(spec.curve ?? "loop", spec, quality);
      const material = makeFinish(spec.finish ?? { kind: "lacquer", colour: spec.colour }, lite);
      return { spec, obj: null, built, material };
    });

    return {
      pieces,
      top: Object.fromEntries(
        pieces.map((p) => [p.spec.id, p.obj ? p.obj.top : (p.built?.top ?? 1)]),
      ) as Record<ObjectId, number>,
      wireGeo: new THREE.CylinderGeometry(WIRE_RADIUS, WIRE_RADIUS, 1, 6, 1, true),
      wire: new THREE.MeshBasicMaterial({ color: CHARCOAL, transparent: true, opacity: 0 }),
    };
  }, [quality, shadows]);

  useEffect(
    () => () => {
      for (const p of res.pieces) {
        p.obj?.dispose();
        p.built?.tube.dispose();
        p.built?.capGeometry?.dispose();
        p.material?.dispose();
      }
      res.wireGeo.dispose();
      res.wire.dispose();
    },
    [res],
  );

  /* ----- refs: registered by callback so the piece list stays data-driven ----- */
  const root = useRef<THREE.Group>(null);
  const groups = useRef<Partial<Record<ObjectId, THREE.Group>>>({});
  const spins = useRef<Partial<Record<ObjectId, THREE.Group>>>({});
  const links = useRef<Array<Wire | null>>([]);
  const hangs = useRef<Partial<Record<ObjectId, Wire>>>({});

  const set = compact ? choreography.mobile : choreography.desktop;
  const live = useRef<Record<ObjectId, Live>>(
    Object.fromEntries(OBJECT_IDS.map((id) => [id, toLive(set.hero[id])])) as Record<ObjectId, Live>,
  );
  const wires = useRef({ links: 0, hang: 0 });
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const frames = useRef(0);
  const firstFrameSent = useRef(false);
  const lastScroll = useRef(-1);
  const shadowMat = useRef<THREE.ShadowMaterial>(null);

  /* Subtle pointer response — fine pointers only, never on touch. */
  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  const tmp = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), d: new THREE.Vector3() }), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 20);
    const aspect = size.width / size.height;

    // Reduced motion: hold the opening composition; the stage fades out past it.
    const descent = reducedMotion ? null : activeDescent();
    // Leaving the project descent for About: the last project's object has
    // already fallen out of the frame, so the hand-off starts from away.
    const leftDescent = !reducedMotion && !descent && isDescent(sceneIdAt(track.from));
    const A: Scene = reducedMotion ? set.hero : leftDescent ? set.away : (set[sceneIdAt(track.from)] ?? set.away);
    const B: Scene = reducedMotion ? set.hero : (set[sceneIdAt(track.to)] ?? set.away);
    // A scene can hold its pieces back until late in the approach (`enter`),
    // so they arrive once the previous section's text has scrolled away.
    const enter = B.enter ?? 0;
    const t = reducedMotion ? 0 : Math.min(1, Math.max(0, (track.t - enter) / (1 - enter)));
    const k = reducedMotion || frames.current < 2 ? 1 : 1 - Math.exp(-DAMPING * dt);

    let motion = 0;
    let anyVisible = false;
    const time = state.clock.elapsedTime;
    const sc = track.scroll;
    const phaseA = sceneProgress(track.from);
    const phaseB = sceneProgress(track.to);
    const opening = journey();

    SCULPTURES.forEach((spec, i) => {
      const id = spec.id;
      const pa = A[id];
      const pb = B[id];
      const ar = pa.r.map((value, axis) => value + (A.turn?.[id]?.[axis] ?? 0) * phaseA);
      const br = pb.r.map((value, axis) => value + (B.turn?.[id]?.[axis] ?? 0) * phaseB);
      const L = live.current[id];
      // Both ends out of frame: snap between them, never drag a piece (or its
      // shadow) through the page on a straight line between two exits.
      const jump = offscreen(pa) && offscreen(pb);
      // A piece leaving clears the frame early; a piece arriving lands late,
      // so two objects never cross on the way.
      const leaving = !offscreen(pa) && offscreen(pb);
      const arriving = offscreen(pa) && !offscreen(pb);
      const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
      const u = jump
        ? t < 0.5 ? 0 : 1
        : leaving
          ? clamp01(t / 0.55)
          : arriving
            ? clamp01((t - 0.4) / 0.6)
            : t;
      const target: Live = {
        x: pa.x + (pb.x - pa.x) * u,
        y: pa.y + (pb.y - pa.y) * u,
        z: pa.z + (pb.z - pa.z) * u,
        rx: ar[0] + (br[0] - ar[0]) * u,
        ry: ar[1] + (br[1] - ar[1]) * u,
        rz: ar[2] + (br[2] - ar[2]) * u,
        s: pa.s + (pb.s - pa.s) * u,
      };
      // The statement: the loop holds through the middle line, then floats
      // off up and to the right as the reel card rises in.
      if (!compact && !reducedMotion && opening.active && id === "loop") {
        const away = range(opening.progress, 0.14, 0.34);
        const start = set.studio.loop;
        target.x = start.x + (1.5 - start.x) * away;
        target.y = start.y + (1.3 - start.y) * away;
        target.z = start.z;
        target.rx = start.r[0] + 0.9 * away;
        target.ry = start.r[1] - 0.6 * away;
        target.rz = start.r[2] + 1.2 * away;
        target.s = start.s;
      }
      // From the first project to Contact: every piece in the scene on stage
      // rides it down the screen (descent.ts) and follows it exactly, so it
      // never lags its word; pieces not in that scene wait off-frame.
      let locked = false;
      if (descent) {
        const scene = set[descent.id];
        const pose = scene?.[id];
        if (pose && !offscreen(pose)) {
          const spin = scene.turn?.[id];
          const q = Math.min(1, Math.max(0, descent.p));
          Object.assign(target, toLive(pose));
          if (spin) {
            target.rx += spin[0] * q;
            target.ry += spin[1] * q;
            target.rz += spin[2] * q;
          }
          target.y -= 2 * descent.offset;
          target.s *= descent.grow;
        } else {
          Object.assign(target, toLive(set.away[id]));
        }
        locked = true;
      }
      for (const key of ["x", "y", "z", "rx", "ry", "rz", "s"] as const) {
        const d = target[key] - L[key];
        L[key] += d * (jump || locked ? 1 : k);
        motion = Math.max(motion, Math.abs(d));
      }

      const g = groups.current[id];
      if (!g) return;
      const hh = halfH(L.z);
      g.position.set(L.x * hh * aspect, L.y * hh, L.z);
      g.scale.setScalar((L.s * hh) / H0);

      // A very slow breathing sway so the pieces feel suspended, not pasted.
      // Not on phones: it would keep the GPU rendering every frame at rest.
      const sway = reducedMotion || compact ? 0 : Math.sin(time * 0.42 + i * 1.7) * 0.03;
      g.rotation.set(L.rx + sway, L.ry + sway * 0.6, L.rz);

      // Scroll-linked rotation on each piece's own axes.
      const sp = spins.current[id];
      if (sp) sp.rotation.set(0, 0, 0);

      const radius = spec.size * L.s * 0.65 / H0;
      const visible = Math.abs(L.x) < 1 + radius / aspect && Math.abs(L.y) < 1 + radius && (!compact || spec.phone);
      g.visible = visible;
      anyVisible ||= visible;
    });

    // Wires.
    const wa = A.links + (B.links - A.links) * t;
    const wh = A.hang + (B.hang - A.hang) * t;
    wires.current.links += (wa - wires.current.links) * k;
    wires.current.hang += (wh - wires.current.hang) * k;
    motion = Math.max(motion, Math.abs(wa - wires.current.links), Math.abs(wh - wires.current.hang));
    // Hanging wires only appear as the mobile settles, not while text is passing.
    const hangShown = Math.min(1, Math.max(0, (wires.current.hang - 0.6) / 0.4));
    // All wires share one material; set its opacity through any wire's ref.
    const anyWire = links.current[0] ?? hangs.current.loop;
    if (anyWire) anyWire.material.opacity = Math.max(wires.current.links, hangShown) * 0.9;

    LINKS.forEach(([from, to], i) => {
      const w = links.current[i];
      const a = groups.current[from];
      const b = groups.current[to];
      if (!w) return;
      w.visible = !!a && !!b && wires.current.links > 0.01 && a.visible && b.visible;
      if (!w.visible || !a || !b) return;
      tmp.a.copy(a.position).setZ(a.position.z - 0.3);
      tmp.b.copy(b.position).setZ(b.position.z - 0.3);
      span(w, tmp.a, tmp.b, tmp.d);
    });
    for (const id of HANGERS) {
      const w = hangs.current[id];
      const g = groups.current[id];
      if (!w || !g) continue;
      w.visible = hangShown > 0.01 && g.visible;
      if (!w.visible) continue;
      tmp.a.set(g.position.x, halfH(g.position.z) * 1.25, g.position.z);
      tmp.b.set(g.position.x, g.position.y + res.top[id] * g.scale.x * 0.9, g.position.z);
      span(w, tmp.a, tmp.b, tmp.d);
    }

    // Softer page shadows in the bright project scenes.
    if (shadowMat.current) {
      const pw = (sceneIdAt(track.from).startsWith("p-") ? 1 - track.t : 0) + (sceneIdAt(track.to).startsWith("p-") ? track.t : 0);
      shadowMat.current.opacity = 0.07 - 0.045 * pw;
    }

    // Pointer parallax on the whole installation.
    const p = pointer.current;
    p.x += (p.tx - p.x) * (1 - Math.exp(-3 * dt));
    p.y += (p.ty - p.y) * (1 - Math.exp(-3 * dt));
    if (root.current) {
      const strength = 1;
      root.current.rotation.y = p.x * 0.05 * strength;
      root.current.rotation.x = p.y * 0.035 * strength;
    }
    const pointerMoving = Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.0005;

    // Render only when something is actually changing on screen. Desktop
    // keeps rendering while pieces are in view (the sway); phones only while
    // scrolling or settling.
    const idle = anyVisible && !reducedMotion && !compact;
    if (frames.current < 3 || motion > 0.0004 || idle || pointerMoving || sc !== lastScroll.current) {
      state.gl.render(state.scene, state.camera);
      lastScroll.current = sc;
      if (!firstFrameSent.current) {
        firstFrameSent.current = true;
        onFirstFrame();
      }
    }
    frames.current++;
  }, 1);

  return (
    <>
      {/* Studio light: a broad soft key from upper left, a warm bounce from
          below, a cool edge from the right. */}
      <hemisphereLight args={["#ffffff", "#e9e1d3", 1.0]} />
      <directionalLight
        position={[-4, 6, 9]}
        intensity={2.0}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-radius={9}
        shadow-bias={-0.0006}
        shadow-normalBias={0.03}
      />
      <directionalLight position={[6, -1, 5]} intensity={0.45} color="#eef1ff" />
      <directionalLight position={[0, -6, 4]} intensity={0.35} color="#fff2e2" />

      {/* A studio for metal and glass: a lavender-grey room, long softbox
          strips overhead and at the sides, one dark flag for contrast. */}
      <Environment resolution={quality === "high" ? 512 : 128} frames={1}>
        <color attach="background" args={["#b9b4d6"]} />
        <Lightformer form="rect" intensity={4} position={[0, 7, 2]} scale={[14, 1.6, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.4} position={[-2, 5, -4]} scale={[12, 1, 1]} rotation-x={Math.PI / 2.4} />
        <Lightformer form="rect" intensity={3} position={[-8, 1, 2]} scale={[2, 10, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={2.2} color="#ffe3d8" position={[8, 1, 1]} scale={[2, 9, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} color="#f2efff" position={[0, -5, 2]} scale={[16, 3, 1]} rotation-x={-Math.PI / 2} />
        <Lightformer form="rect" intensity={0} color="#1b2236" position={[0, 1, -8]} scale={[10, 6, 1]} />
        <Lightformer form="ring" intensity={2.5} position={[4, 4, 6]} scale={2.2} />
      </Environment>

      {/* The page itself, catching soft shadows so the pieces float above it. */}
      {shadows && (
        <mesh position={[0, 0, -1.4]} receiveShadow>
          <planeGeometry args={[80, 60]} />
          <shadowMaterial ref={shadowMat} transparent opacity={0.05} color="#2a2550" />
        </mesh>
      )}

      <StageDressing quality={quality} enabled={!reducedMotion} shadows={shadows} compact={compact} />

      <group ref={root}>
        {res.pieces.map(({ spec, built, material, obj }) => (
          <group
            key={spec.id}
            ref={(g) => {
              if (g) groups.current[spec.id] = g;
              else delete groups.current[spec.id];
            }}
          >
            <group
              ref={(g) => {
                if (g) spins.current[spec.id] = g;
                else delete spins.current[spec.id];
              }}
            >
              {spec.model ? (
                <Suspense fallback={obj ? <primitive object={obj.group} /> : null}>
                  <ModelPiece url={spec.model} size={spec.size} shadows={shadows} />
                </Suspense>
              ) : obj ? (
                <primitive object={obj.group} />
              ) : built && material ? (
                <>
                  <mesh
                    geometry={built.tube}
                    material={material}
                    castShadow={shadows}
                    receiveShadow={shadows}
                  />
                  {built.capGeometry &&
                    built.caps.map((c, i) => (
                      <mesh
                        key={i}
                        geometry={built.capGeometry as THREE.SphereGeometry}
                        material={material}
                        position={c}
                        castShadow={shadows}
                        receiveShadow={shadows}
                      />
                    ))}
                </>
              ) : null}
            </group>
          </group>
        ))}

        {LINKS.map((_, i) => (
          <mesh
            key={`link-${i}`}
            ref={(w: Wire | null) => {
              links.current[i] = w;
            }}
            geometry={res.wireGeo}
            material={res.wire}
            visible={false}
          />
        ))}
        {HANGERS.map((id) => (
          <mesh
            key={`hang-${id}`}
            ref={(w: Wire | null) => {
              if (w) hangs.current[id] = w;
              else delete hangs.current[id];
            }}
            geometry={res.wireGeo}
            material={res.wire}
            visible={false}
          />
        ))}
      </group>
    </>
  );
}
