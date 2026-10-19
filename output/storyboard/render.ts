import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildSculpture, makeGrainTexture, makeSpeckleTexture } from "../../components/scene/geometry";
import { SCULPTURES } from "../../components/scene/sculptures";

// Storyboard assets only. Reuses the website's authored geometry and surface maps.
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(1800, 1800);
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 40);
camera.position.set(0, 0, 6.4);
scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e1d3, 1));
const key = new THREE.DirectionalLight(0xffffff, 2);
key.position.set(-4, 6, 9);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 1, far: 30 });
key.shadow.bias = -0.0006;
key.shadow.normalBias = 0.03;
scene.add(key);
const edge = new THREE.DirectionalLight(0xeef1ff, 0.45);
edge.position.set(6, -1, 5);
scene.add(edge);
const bounce = new THREE.DirectionalLight(0xfff2e2, 0.35);
bounce.position.set(0, -6, 4);
scene.add(bounce);
const pmrem = new THREE.PMREMGenerator(renderer);
const room = new RoomEnvironment();
scene.environment = pmrem.fromScene(room).texture;
const groups = new Map<string, THREE.Group>();
for (const spec of SCULPTURES.filter(s => ["loop", "twist", "knot"].includes(s.id))) {
  const built = buildSculpture(spec.curve ?? "loop", spec, "high");
  const map = makeSpeckleTexture();
  const bump = makeGrainTexture();
  map.repeat.set(...built.grainRepeat);
  bump.repeat.set(...built.grainRepeat);
  const material = new THREE.MeshStandardMaterial({ color: spec.colour, map, bumpMap: bump, bumpScale: 1.3, roughness: 0.62, metalness: 0, envMapIntensity: 0.4 });
  const group = new THREE.Group();
  const mesh = new THREE.Mesh(built.tube, material);
  mesh.castShadow = mesh.receiveShadow = true;
  group.add(mesh);
  group.visible = false;
  scene.add(group);
  groups.set(spec.id, group);
}
const poses = { loop: [0.42, -0.5, 0.55], twist: [0.45, 0.35, 0.3], knot: [0.5, 0.6, 0.2] };
(window as unknown as { renderShape: (id: keyof typeof poses) => void }).renderShape = (id) => {
  groups.forEach((group, key) => {
    group.visible = key === id;
    group.rotation.set(...poses[id] as [number, number, number]);
  });
  renderer.render(scene, camera);
};
