// Simplex noise by Ian McEwan / Ashima Arts (MIT). Used for the surface displacement.
export const noiseChunk = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uSwirl;
uniform vec2  uPointer;

varying vec3 vNormalW;
varying vec3 vPosW;
varying float vDisp;

${noiseChunk}

// Layered noise, sampled twice more along the tangent basis so the normal
// can be rebuilt after displacement — without this the lighting stays flat
// and the whole thing reads as a sticker.
float field(vec3 p) {
  float t = uTime * 0.16;
  float n  = snoise(p * uFreq + vec3(0.0, t, 0.0));
  n += 0.38 * snoise(p * uFreq * 1.9 + vec3(t * 1.4, 0.0, 0.0));
  n += 0.14 * snoise(p * uFreq * 3.4 - vec3(0.0, 0.0, t * 0.8));
  // pointer pulls the surface toward the cursor
  float pull = 1.0 - smoothstep(0.0, 1.6, distance(p.xy, uPointer * 1.5));
  return n * 0.66 + pull * uSwirl;
}

void main() {
  vec3 p = position;
  float d = field(p);

  // rebuild normals from three samples of the displaced surface
  vec3 tangent  = normalize(abs(normal.y) < 0.99 ? cross(normal, vec3(0.0,1.0,0.0)) : vec3(1.0,0.0,0.0));
  vec3 bitangent = normalize(cross(normal, tangent));
  float e = 0.035;
  vec3 pa = p + tangent  * e;
  vec3 pb = p + bitangent * e;
  vec3 dp  = p  + normal * d * uAmp;
  vec3 dpa = pa + normalize(pa) * field(pa) * uAmp;
  vec3 dpb = pb + normalize(pb) * field(pb) * uAmp;
  vec3 n = normalize(cross(dpa - dp, dpb - dp));
  if (dot(n, normal) < 0.0) n = -n;

  vDisp = d;
  vNormalW = normalize(normalMatrix * n);
  vec4 worldPos = modelViewMatrix * vec4(dp, 1.0);
  vPosW = worldPos.xyz;
  gl_Position = projectionMatrix * worldPos;
}
`;

export const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;
uniform vec3  uLightDir;
uniform float uShift;

varying vec3 vNormalW;
varying vec3 vPosW;
varying float vDisp;

// Cheap thin-film approximation: sample a three-stop ramp by view angle so the
// hue travels across the surface the way real iridescence does, rather than
// being painted on as a gradient.
vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5
    ? mix(uColorA, uColorB, t * 2.0)
    : mix(uColorB, uColorC, (t - 0.5) * 2.0);
}

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(-vPosW);
  vec3 L = normalize(uLightDir);

  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.2);
  float facing = clamp(dot(N, V), 0.0, 1.0);

  vec3 base = ramp(facing * 0.85 + vDisp * 0.22 + uShift);

  // broad key + tight specular
  float diff = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float spec = pow(clamp(dot(N, H), 0.0, 1.0), 92.0);
  float spec2 = pow(clamp(dot(N, normalize(vec3(-0.6, -0.3, 1.0))), 0.0, 1.0), 34.0);

  vec3 col = base * (0.22 + diff * 0.85);
  col += vec3(1.0) * spec * 0.9;
  col += vec3(0.55, 0.75, 1.0) * spec2 * 0.22;
  col += ramp(1.0 - facing) * fres * 0.75;

  // fall the silhouette into the page rather than cutting it off
  col *= smoothstep(-0.15, 0.55, facing + 0.35);

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;
