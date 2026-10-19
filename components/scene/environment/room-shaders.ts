export const vertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform vec2 uPointer;
uniform float uJourney;

float surface(vec2 p) {
  float sweep = p.x * .42 + p.y * .24 + uPointer.x * .14;
  return sin(sweep + uTime * .08) * 1.4
    + cos(p.y * .5 - p.x * .16 + uTime * .055) * 1.1
    + pow(abs(p.x) / 13., 3.) * 2.3
    + sin(p.x * .17 - p.y * .32) * uJourney * .6;
}
void main() {
  vUv = uv;
  vec3 p = position;
  p.z += surface(p.xy);
  float dx = (surface(p.xy + vec2(.01, 0.)) - surface(p.xy - vec2(.01, 0.))) / .02;
  float dy = (surface(p.xy + vec2(0., .01)) - surface(p.xy - vec2(0., .01))) / .02;
  vNormal = normalize(vec3(-dx, -dy, 1.));
  vPosition = p;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
}`;

export const fragment = /* glsl */ `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float uTime;
uniform float uJourney;
uniform vec2 uPointer;
uniform vec3 uPaper;
uniform vec3 uCoast;
uniform vec3 uTint;
uniform float uTintAmount;
uniform float uLift;

float grain(vec2 uv) { return fract(sin(dot(uv, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec3 normal = normalize(vNormal);
  vec3 light = normalize(vec3(-.55 + uPointer.x * .12, .8, .85));
  float diffuse = max(0., dot(normal, light));
  float shadow = smoothstep(-.5, 1., vPosition.z);
  vec3 base = mix(uPaper, uCoast, uJourney * .72);
  // Project scenes lift the room toward an even, airy paper (uLift).
  // Project scenes go high-key: an even, bright paper with almost no fold shading.
  base = mix(base, vec3(.975, .968, .95), uLift * .55);
  vec3 colour = base * (mix(.46, .9, uLift) + diffuse * mix(.54, .12, uLift));
  // Broad grazing highlights describe the curvature of the matte surface.
  float highlight = pow(max(dot(normal, normalize(light + vec3(0., 0., 1.))), 0.), 24.);
  colour += vec3(.16, .145, .12) * highlight;
  float windowLight = sin((vUv.x * 1.1 + vUv.y * .38) * 19. - uTime * .035);
  windowLight = smoothstep(.84, .98, windowLight);
  float side = smoothstep(.38, .95, vUv.x);
  colour *= 1. - windowLight * side * .085;
  colour -= (1. - shadow) * .035;
  float glow = exp(-length((vUv - vec2(.38 + uPointer.x * .015, .65)) * vec2(2.1, 1.8)) * 2.);
  colour += vec3(.08, .065, .04) * glow;
  // A soft pool of the project's colour behind its piece.
  float pool = exp(-length((vUv - vec2(.5, .42)) * vec2(1.3, 1.9)) * 2.2);
  float pool2 = exp(-length((vUv - vec2(.18, .8)) * vec2(1.8, 2.2)) * 2.6);
  colour = mix(colour, mix(colour, uTint, .45), uTintAmount * (pool + pool2 * .6));
  colour += (grain(gl_FragCoord.xy) - .5) * .009;
  gl_FragColor = vec4(colour, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
