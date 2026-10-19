"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

/**
 * A modelled project piece (glTF / GLB), dropped in to replace a procedural
 * one. The model is centred and scaled so its largest side equals `size`
 * world units — the same footprint as the code shape it replaces — and keeps
 * the artist's own materials. Draco-compressed files decode locally (/draco/).
 */
export function ModelPiece({ url, size, shadows }: { url: string; size: number; shadows: boolean }) {
  const gltf = useGLTF(url, "/draco/");
  const scene = useMemo(() => {
    const root = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(root);
    const dim = box.getSize(new THREE.Vector3());
    const k = size / Math.max(dim.x, dim.y, dim.z, 1e-6);
    const centre = box.getCenter(new THREE.Vector3());
    root.position.sub(centre.multiplyScalar(k));
    root.scale.multiplyScalar(k);
    root.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = shadows;
        o.receiveShadow = shadows;
      }
    });
    return root;
  }, [gltf.scene, size, shadows]);
  return <primitive object={scene} />;
}
