/**
 * Hero scene — a turning gold medallion in a shaft of chalk-lit air.
 *
 * Technique adapted from ThreeUI's `SylvaHero` (MIT, threeui.com): a
 * transparent WebGL canvas layered over the page, instanced geometry driven by
 * shaders, deterministic noise so the scene is identical on every load, capped
 * device pixel ratio, an idle/offscreen pause, and a reduced-motion path.
 *
 * The subject is not Sylva's. That scene grows moss, ferns and a butterfly;
 * recoloured for a gym it would read worse than no scene at all. This turns the
 * Atlas mark as a struck metal medallion — gold body, white specular sweep, a
 * trace of brand red at the rim — hanging in drifting chalk dust.
 *
 * Two lights are computed in the fragment shader rather than using Three's
 * lighting: with one object and no environment map, a hand-written Blinn-Phong
 * pair gives a cleaner, more controllable metal than MeshStandardMaterial
 * without an HDRI, and costs a fraction of the bytes.
 *
 * Loaded dynamically, only when the hero is on screen, so none of it sits on
 * the critical path.
 */

import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

/** Deterministic PRNG, so the same chalk hangs in the same air on every load. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Read a colour from tokens.css so a rebrand carries into the 3D for free. */
function tokenColor(el: Element, name: string, fallback: string): Color {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  try {
    return new Color(raw || fallback);
  } catch {
    return new Color(fallback);
  }
}

/* ------------------------------------------------------------------ *
 * Chalk dust
 * ------------------------------------------------------------------ */

const DUST_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uDrift;
  uniform vec2  uPointer;
  uniform float uPixelRatio;
  uniform float uBounds;

  attribute float aSize;
  attribute float aSeed;
  attribute float aTint;

  varying float vAlpha;
  varying float vTint;

  void main() {
    vec3 p = position;

    // Slow convection: chalk does not fall, it hangs and turns over.
    float t = uTime * uDrift;
    p.y += sin(t * 0.33 + aSeed * 6.2831) * 6.0;
    p.x += cos(t * 0.26 + aSeed * 4.1) * 5.0;
    p.z += sin(t * 0.21 + aSeed * 2.7) * 4.0;

    // Wrap through the volume so the field never empties.
    p.y = mod(p.y + uBounds, uBounds * 2.0) - uBounds;

    // Near motes move further than far ones under the pointer. That parallax
    // is what reads as depth rather than as a moving picture.
    float depth = smoothstep(-uBounds, uBounds, p.z);
    p.xy += uPointer * mix(2.0, 13.0, depth);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    float fade = smoothstep(0.0, 0.22, depth) * (1.0 - smoothstep(0.78, 1.0, depth));

    // The shaft: a soft diagonal band from the upper left. Motes inside it are
    // lit; motes outside it are barely there.
    float shaft = 1.0 - smoothstep(0.0, 60.0, abs(p.x * 0.72 + p.y * 0.62 + 10.0));

    vAlpha = fade * mix(0.05, 1.0, shaft);
    vTint = aTint * shaft;

    gl_PointSize = aSize * uPixelRatio * (190.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const DUST_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uChalk;
  uniform vec3 uEmber;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vTint;

  void main() {
    // Squared falloff keeps the core tight and the edge long, which is what
    // reads as dust rather than as a sprite.
    vec2 d = gl_PointCoord - vec2(0.5);
    float r = dot(d, d);
    if (r > 0.25) discard;
    float f = 1.0 - smoothstep(0.0, 0.25, r);
    f *= f;
    gl_FragColor = vec4(mix(uChalk, uEmber, vTint), f * vAlpha * uOpacity);
  }
`;

/* ------------------------------------------------------------------ *
 * Medallion face — struck gold with the mark embossed into it
 * ------------------------------------------------------------------ */

const FACE_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vViewPos;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FACE_FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec3  uGoldDeep;
  uniform vec3  uGoldLit;
  uniform vec3  uWhite;
  uniform vec3  uEmber;
  uniform float uSpin;
  uniform float uDim;

  varying vec2 vUv;
  varying vec3 vViewPos;

  void main() {
    vec2 uv = vUv;

    // Circular die: everything outside the struck disc is cut away.
    vec2 c = uv - 0.5;
    float rad = length(c) * 2.0;
    if (rad > 1.0) discard;

    // Zoom the mark within the die so the figure fills the coin instead of
    // floating in a wide blank field.
    vec2 muv = (uv - 0.5) / 0.74 + 0.5;
    float a = (muv.x < 0.0 || muv.x > 1.0 || muv.y < 0.0 || muv.y > 1.0)
      ? 0.0
      : texture2D(uMap, muv).a;

    // Emboss. Sampling the mask either side gives a gradient, and the gradient
    // is the surface tilt — so the mark is raised metal, not a printed decal.
    float e = 1.0 / 512.0;
    float dx = texture2D(uMap, muv + vec2(e, 0.0)).a - texture2D(uMap, muv - vec2(e, 0.0)).a;
    float dy = texture2D(uMap, muv + vec2(0.0, e)).a - texture2D(uMap, muv - vec2(0.0, e)).a;
    vec3 N = normalize(vec3(-dx * 7.0, -dy * 7.0, 1.0));

    vec3 V = normalize(-vViewPos);

    // Two lights, hand-placed: a warm key from the upper left, a cool rim from
    // the right. Metal needs a second source or it reads as flat plastic.
    vec3 L1 = normalize(vec3(-0.55, 0.75, 0.65));
    vec3 L2 = normalize(vec3(0.85, 0.15, 0.45));

    float d1 = max(dot(N, L1), 0.0);
    float d2 = max(dot(N, L2), 0.0);
    float s1 = pow(max(dot(N, normalize(L1 + V)), 0.0), 64.0);
    float s2 = pow(max(dot(N, normalize(L2 + V)), 0.0), 128.0);

    // A highlight band that travels across the face as the coin turns, so the
    // metal catches the light instead of being uniformly bright.
    float sweep = smoothstep(0.30, 0.0, abs(fract(uv.x * 0.55 - uSpin * 0.22) - 0.5) - 0.14);

    // The field is darker than the raised mark, so the emblem reads first.
    // A faint disc field so the die reads as metal rather than as a floating
    // outline, kept low enough that the photograph still shows through it.
    float field = mix(0.30, 1.0, a) * mix(1.0, 0.62, smoothstep(0.2, 1.0, rad));
    vec3 base = uGoldDeep * field;

    vec3 col = base;
    col += uGoldLit * d1 * mix(0.30, 0.95, a);
    col += uGoldLit * d2 * 0.22;
    col += uWhite * s1 * mix(0.30, 1.25, a);
    col += uWhite * s2 * 0.60;
    col += uWhite * sweep * mix(0.06, 0.42, a);
    // A cold sliver along the raised edge — the tell that metal is polished.
    col += uGoldLit * pow(max(1.0 - abs(N.z), 0.0), 2.2) * 0.55;

    // Brand red only where the die curves away at the very edge.
    float rim = smoothstep(0.90, 1.0, rad);
    col = mix(col, uEmber, rim * 0.22);

    // Vignette so the disc sits in the dark rather than glowing as a flat cut-out.
    col *= mix(1.0, 0.55, smoothstep(0.45, 1.0, rad));

    // Anti-alias the die edge instead of leaving a hard jaggy circle.
    float edge = 1.0 - smoothstep(0.985, 1.0, rad);
    gl_FragColor = vec4(col * uDim, edge);
  }
`;

/** A soft additive glow so the medallion sits in light rather than on black. */
const GLOW_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    float r = length(vUv - 0.5) * 2.0;
    float f = 1.0 - smoothstep(0.0, 1.0, r);
    f = pow(f, 2.6);
    gl_FragColor = vec4(uColor, f * uStrength);
  }
`;

const GLOW_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export interface HeroSceneHandle {
  destroy(): void;
}

export function createHeroScene(canvas: HTMLCanvasElement, markUrl: string): HeroSceneHandle | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
  } catch {
    // No WebGL: the hero photograph and scrim stand on their own.
    return null;
  }

  const host = canvas.parentElement ?? document.body;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 48em)').matches;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 1, 700);
  camera.position.set(0, 0, 150);

  const chalk = tokenColor(host, '--ink-0', '#ffffff');
  const ember = tokenColor(host, '--red-400', '#ef4c63');
  // Gold comes from tokens.css like every other colour, so the medallion
  // follows a rebrand rather than drifting away from the palette.
  const goldDeep = tokenColor(host, '--gold-600', '#8a6a1f');
  const goldLit = tokenColor(host, '--gold-400', '#d4af67');

  /* ---- medallion ---- */
  const medallion = new Group();
  // Kept high and to one side so it never sits behind the headline.
  medallion.position.set(small ? 6 : 40, small ? 40 : 16, small ? -70 : -50);
  scene.add(medallion);

  const R = small ? 24 : 40;
  const THICK = R * 0.055;

  const faceUniforms = () => ({
    uMap: { value: null as unknown },
    uTime: { value: 0 },
    uSpin: { value: 0 },
    uGoldDeep: { value: goldDeep },
    uGoldLit: { value: goldLit },
    uWhite: { value: chalk },
    uEmber: { value: ember },
    // The medallion is atmosphere behind a headline, never a competitor to it.
    uDim: { value: small ? 0.5 : 0.68 },
  });

  const frontMat = new ShaderMaterial({
    vertexShader: FACE_VERT,
    fragmentShader: FACE_FRAG,
    uniforms: faceUniforms(),
    transparent: true,
    side: DoubleSide,
  });
  const backMat = new ShaderMaterial({
    vertexShader: FACE_VERT,
    fragmentShader: FACE_FRAG,
    uniforms: faceUniforms(),
    transparent: true,
    side: DoubleSide,
  });

  const faceGeo = new CircleGeometry(R, 96);
  const front = new Mesh(faceGeo, frontMat);
  front.position.z = THICK / 2;
  const back = new Mesh(faceGeo, backMat);
  back.position.z = -THICK / 2;
  back.rotation.y = Math.PI;
  medallion.add(front, back);

  // The rim gives the coin real thickness, so edge-on it is a struck sliver
  // rather than vanishing to nothing.
  const rim = new Mesh(
    new CylinderGeometry(R, R, THICK, 96, 1, true),
    new MeshBasicMaterial({ color: goldDeep.clone().multiplyScalar(1.15), side: DoubleSide }),
  );
  rim.rotation.x = Math.PI / 2;
  medallion.add(rim);

  // Glow sits behind the coin, never in front.
  const glow = new Mesh(
    new CircleGeometry(R * 2.9, 48),
    new ShaderMaterial({
      vertexShader: GLOW_VERT,
      fragmentShader: GLOW_FRAG,
      uniforms: { uColor: { value: goldLit }, uStrength: { value: small ? 0.08 : 0.13 } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: BackSide,
    }),
  );
  glow.position.z = -THICK;
  glow.rotation.y = Math.PI;
  medallion.add(glow);

  new TextureLoader().load(markUrl, (tex) => {
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    frontMat.uniforms.uMap!.value = tex;
    backMat.uniforms.uMap!.value = tex;
    if (reduced) renderer.render(scene, camera);
  });

  /* ---- chalk dust ---- */
  const BOUNDS = 90;
  const COUNT = small ? 850 : 2000;
  const rand = mulberry32(0x0a71a5);

  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const seeds = new Float32Array(COUNT);
  const tints = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i += 1) {
    positions[i * 3] = (rand() * 2 - 1) * BOUNDS * 1.6;
    positions[i * 3 + 1] = (rand() * 2 - 1) * BOUNDS;
    positions[i * 3 + 2] = (rand() * 2 - 1) * BOUNDS;
    sizes[i] = 0.6 + Math.pow(rand(), 3) * 5.0;
    seeds[i] = rand();
    tints[i] = rand() < 0.1 ? 0.5 + rand() * 0.5 : 0;
  }

  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  dustGeo.setAttribute('aSize', new Float32BufferAttribute(sizes, 1));
  dustGeo.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1));
  dustGeo.setAttribute('aTint', new Float32BufferAttribute(tints, 1));

  const dustMat = new ShaderMaterial({
    vertexShader: DUST_VERT,
    fragmentShader: DUST_FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uDrift: { value: reduced ? 0 : 1 },
      uPointer: { value: new Vector2(0, 0) },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uBounds: { value: BOUNDS },
      uChalk: { value: chalk },
      uEmber: { value: ember },
      uOpacity: { value: small ? 0.45 : 0.58 },
    },
  });

  scene.add(new Points(dustGeo, dustMat));

  /* ---- sizing ---- */
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dustMat.uniforms.uPixelRatio!.value = renderer.getPixelRatio();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  /* ---- pointer, damped ---- */
  const target = new Vector2(0, 0);
  const onPointer = (event: PointerEvent) => {
    const r = host.getBoundingClientRect();
    target.set(
      ((event.clientX - r.left) / r.width) * 2 - 1,
      -(((event.clientY - r.top) / r.height) * 2 - 1),
    );
  };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

  /* ---- loop ---- */
  // three's Clock is deprecated as of r185; performance.now() is what it wrapped.
  const t0 = performance.now();
  const elapsed = () => (performance.now() - t0) / 1000;
  const restPos = new Vector3().copy(medallion.position);
  let raf = 0;
  let running = false;

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const t = elapsed();

    dustMat.uniforms.uTime!.value = t;
    const p = dustMat.uniforms.uPointer!.value as Vector2;
    p.x += (target.x - p.x) * 0.03;
    p.y += (target.y - p.y) * 0.03;

    // An oscillating arc rather than a full revolution. Turning right through
    // 360 degrees leaves the coin edge-on for a large part of every cycle,
    // where it collapses into a bright vertical bar behind the headline. A
    // +/-34 degree sweep keeps the struck face toward the reader throughout.
    medallion.rotation.y = Math.sin(t * 0.19) * 0.6;
    medallion.rotation.x = Math.sin(t * 0.13) * 0.07;
    medallion.position.y = restPos.y + Math.sin(t * 0.42) * 1.6;
    medallion.position.x = restPos.x + p.x * 3.2;

    frontMat.uniforms.uSpin!.value = medallion.rotation.y;
    backMat.uniforms.uSpin!.value = medallion.rotation.y;

    renderer.render(scene, camera);
  };

  const start = () => {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  if (reduced) {
    // Reduced motion gets the composition, not the movement: one considered
    // frame, angled so the emboss still catches both lights.
    medallion.rotation.y = -0.34;
    medallion.rotation.x = 0.05;
    frontMat.uniforms.uSpin!.value = medallion.rotation.y;
    backMat.uniforms.uSpin!.value = medallion.rotation.y;
    renderer.render(scene, camera);

    return {
      destroy() {
        ro.disconnect();
        window.removeEventListener('pointermove', onPointer);
        dustGeo.dispose();
        dustMat.dispose();
        faceGeo.dispose();
        frontMat.dispose();
        backMat.dispose();
        renderer.dispose();
      },
    };
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting) && !document.hidden) start();
      else stop();
    },
    { threshold: 0 },
  );
  io.observe(host);

  const onVisibility = () => {
    if (document.hidden) stop();
    else if (host.getBoundingClientRect().bottom > 0) start();
  };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
      dustGeo.dispose();
      dustMat.dispose();
      faceGeo.dispose();
      frontMat.dispose();
      backMat.dispose();
      renderer.dispose();
    },
  };
}
