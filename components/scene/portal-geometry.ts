import * as THREE from "three";
import { CAMERA } from "./choreography";

class FrameCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private path: THREE.Path) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const p = this.path.getPoint(t);
    return target.set(p.x, p.y, 0);
  }
}

class LensCurve extends THREE.Curve<THREE.Vector3> {
  constructor() { super(); }
  getPoint(t: number, target = new THREE.Vector3()) {
    const angle = t * Math.PI * 2 + Math.PI * 1.25;
    return target.set(
      Math.cos(angle) * 2.05,
      Math.sin(angle) * 1.55,
      Math.sin(angle * 2) * 0.12,
    );
  }
}

/** Equal topology lets the actual hero sculpture become the project frame on the GPU. */
export function addPortalTarget(
  tube: THREE.TubeGeometry,
  width: number,
  height: number,
) {
  const halfHeight =
    Math.tan(THREE.MathUtils.degToRad(CAMERA.fov / 2)) * CAMERA.z;
  const frameWidth = Math.min(width * 0.68, 1040, height * 1.04);
  const halfWidth = (halfHeight * frameWidth) / height;
  const y = halfWidth / 1.6;
  const radius = 0.13;
  const path = new THREE.Path();
  path.moveTo(-halfWidth + radius, -y);
  path.lineTo(halfWidth - radius, -y);
  path.absarc(halfWidth - radius, -y + radius, radius, -Math.PI / 2, 0, false);
  path.lineTo(halfWidth, y - radius);
  path.absarc(halfWidth - radius, y - radius, radius, 0, Math.PI / 2, false);
  path.lineTo(-halfWidth + radius, y);
  path.absarc(
    -halfWidth + radius,
    y - radius,
    radius,
    Math.PI / 2,
    Math.PI,
    false,
  );
  path.lineTo(-halfWidth, -y + radius);
  path.absarc(
    -halfWidth + radius,
    -y + radius,
    radius,
    Math.PI,
    Math.PI * 1.5,
    false,
  );
  const target = new THREE.TubeGeometry(
    new FrameCurve(path),
    tube.parameters.tubularSegments,
    0.027,
    tube.parameters.radialSegments,
    true,
  );
  const lens = new THREE.TubeGeometry(
    new LensCurve(),
    tube.parameters.tubularSegments,
    0.16,
    tube.parameters.radialSegments,
    true,
  );
  tube.morphAttributes.position = [
    target.getAttribute("position").clone(),
    lens.getAttribute("position").clone(),
  ];
  tube.morphAttributes.normal = [
    target.getAttribute("normal").clone(),
    lens.getAttribute("normal").clone(),
  ];
  // A morph may extend beyond the original small loop's bounds.
  tube.boundingSphere = new THREE.Sphere(
    new THREE.Vector3(),
    halfWidth + y + 1,
  );
  target.dispose();
  lens.dispose();
}
