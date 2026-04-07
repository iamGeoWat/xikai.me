precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
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

// Dithering to eliminate color banding
float dither(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453) / 255.0;
}

void main() {
  vec2 st = vUv;
  float aspect = uResolution.x / uResolution.y;
  st.x *= aspect;

  // Mouse
  vec2 mouse = uMouse;
  mouse.x *= aspect;
  float mouseDist = length(st - mouse);

  float t = uTime * 0.04;

  // Multiple noise layers at different scales and speeds
  float n1 = snoise(vec3(st * 0.6, t * 0.8));
  float n2 = snoise(vec3(st * 1.2 + 3.0, t * 1.1));
  float n3 = snoise(vec3(st * 2.4 + 7.0, t * 0.5));
  float n4 = snoise(vec3(st * 0.3 + vec2(t * 0.2, 0.0), t * 0.3));

  // Warp coordinates with noise for organic flow
  vec2 warp = st + 0.15 * vec2(n1, n2);
  float nw = snoise(vec3(warp * 1.5, t * 0.7));

  // Color palette — multiple hues that shift across the canvas
  vec3 c1 = vec3(0.05, 0.02, 0.15);  // deep indigo
  vec3 c2 = vec3(0.15, 0.03, 0.12);  // plum
  vec3 c3 = vec3(0.02, 0.08, 0.18);  // ocean blue
  vec3 c4 = vec3(0.12, 0.06, 0.02);  // warm amber
  vec3 c5 = vec3(0.03, 0.12, 0.10);  // teal

  // Blend colors based on different noise channels
  float blend1 = n1 * 0.5 + 0.5;
  float blend2 = n2 * 0.5 + 0.5;
  float blend3 = n4 * 0.5 + 0.5;

  vec3 color = mix(c1, c2, blend1);
  color = mix(color, c3, blend2 * 0.6);
  color = mix(color, c4, smoothstep(0.3, 0.7, blend3) * 0.4);
  color = mix(color, c5, smoothstep(0.5, 0.9, nw * 0.5 + 0.5) * 0.3);

  // Add luminance variation from fine noise
  color += (n3 * 0.5 + 0.5) * 0.08;
  color += nw * 0.04;

  // Mouse glow — warm bright spot that follows cursor
  float mouseGlow = smoothstep(0.8, 0.0, mouseDist);
  color += mouseGlow * 0.15 * vec3(0.4, 0.2, 0.6);
  // Secondary wider ring
  float mouseRing = smoothstep(1.5, 0.3, mouseDist) * 0.06;
  color += mouseRing * vec3(0.2, 0.3, 0.5);

  // Keep it moody — clamp brightness
  color = clamp(color, 0.0, 0.28);

  // Dithering
  color += dither(gl_FragCoord.xy);

  gl_FragColor = vec4(color, 1.0);
}
