import * as THREE from "three";

/**
 * The ODDLY finish library: polished metals, lacquer and glass.
 *
 * The canvas is transparent over the page's lavender ground, so physical
 * transmission would sample an empty buffer and turn black. "Glass" is
 * therefore a tinted, highly specular, partly transparent surface: the page
 * itself shows through it, and the studio environment gives it its edges.
 */

export type Finish =
  | { kind: "chrome" }
  | { kind: "gold" }
  | { kind: "lacquer"; colour: string }
  | { kind: "glass"; colour: string; opacity?: number }
  | { kind: "frosted"; colour: string };

export function makeFinish(f: Finish, lite = false): THREE.Material {
  switch (f.kind) {
    // Metals carry no clearcoat in lite mode, so they take the cheaper
    // standard shader there: the same look for a fraction of the GPU cost.
    case "chrome":
      return new (lite ? THREE.MeshStandardMaterial : THREE.MeshPhysicalMaterial)({
        color: "#e9ebf2",
        metalness: 1,
        roughness: 0.08,
        envMapIntensity: 1.25,
      });
    case "gold":
      if (lite) {
        return new THREE.MeshStandardMaterial({ color: "#e3b54a", metalness: 1, roughness: 0.16, envMapIntensity: 1.35 });
      }
      return new THREE.MeshPhysicalMaterial({
        color: "#e3b54a",
        metalness: 1,
        roughness: 0.16,
        envMapIntensity: 1.35,
        clearcoat: 0.4,
        clearcoatRoughness: 0.1,
      });
    case "lacquer":
      return new THREE.MeshPhysicalMaterial({
        color: f.colour,
        metalness: 0,
        roughness: 0.28,
        clearcoat: lite ? 0.5 : 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1,
      });
    case "glass":
      return new THREE.MeshPhysicalMaterial({
        color: f.colour,
        metalness: 0,
        roughness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        specularIntensity: 1,
        envMapIntensity: 1.6,
        transparent: true,
        opacity: f.opacity ?? 0.62,
        depthWrite: false,
        side: THREE.DoubleSide,
        iridescence: lite ? 0 : 0.35,
        iridescenceIOR: 1.3,
      });
    case "frosted":
      return new THREE.MeshPhysicalMaterial({
        color: f.colour,
        metalness: 0,
        roughness: 0.32,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.1,
        transparent: true,
        opacity: 0.82,
      });
  }
}
