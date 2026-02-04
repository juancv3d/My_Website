import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface SpaceBackgroundProps {
  darkMode: boolean;
}

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// ============================================
// FULLSCREEN NEBULA - Covers entire viewport
// ============================================
const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uBackgroundColor;
  
  varying vec2 vUv;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
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
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
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
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    float time = uTime * 0.06;
    
    // Multiple noise layers for rich nebula
    float n1 = fbm(vec3(uv * 2.0, time)) * 0.5 + 0.5;
    float n2 = fbm(vec3(uv * 3.0 + 5.0, time * 0.7)) * 0.5 + 0.5;
    float n3 = fbm(vec3(uv * 1.5 + 10.0, time * 1.2)) * 0.5 + 0.5;
    
    // Swirl effect
    float swirl = fbm(vec3(uv * 4.0 + vec2(n1, n2) * 0.3, time * 0.5)) * 0.5 + 0.5;
    
    // Color composition
    vec3 color = uBackgroundColor;
    color = mix(color, uColor1, smoothstep(0.2, 0.55, n1) * 0.55);
    color = mix(color, uColor2, smoothstep(0.25, 0.65, n2) * 0.45);
    color = mix(color, uColor3, smoothstep(0.3, 0.7, swirl) * 0.4);
    
    // Soft vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.3;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Fullscreen quad that always covers the screen
const FullscreenNebula = ({ darkMode }: { darkMode: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const colors = useMemo(() => {
    if (darkMode) {
      // Night mode - visible but not too bright nebula
      return {
        background: new THREE.Color('#040015'),
        color1: new THREE.Color('#2a1866'),
        color2: new THREE.Color('#152855'),
        color3: new THREE.Color('#3a2070'),
      };
    } else {
      // Day mode - warm solar nebula
      return {
        background: new THREE.Color('#0a1a30'),
        color1: new THREE.Color('#dd4422'),
        color2: new THREE.Color('#ff7744'),
        color3: new THREE.Color('#cc3344'),
      };
    }
  }, [darkMode]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uBackgroundColor: { value: colors.background },
    uColor1: { value: colors.color1 },
    uColor2: { value: colors.color2 },
    uColor3: { value: colors.color3 },
  }), []);

  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uBackgroundColor.value = colors.background;
      material.uniforms.uColor1.value = colors.color1;
      material.uniforms.uColor2.value = colors.color2;
      material.uniforms.uColor3.value = colors.color3;
    }
  }, [colors]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -50]} frustumCulled={false}>
      <planeGeometry args={[200, 200]} />
      <shaderMaterial
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

// ============================================
// TWINKLING STARS with shader
// ============================================
const starVertexShader = `
  attribute float size;
  attribute float brightness;
  attribute float twinklePhase;
  
  varying float vBrightness;
  varying float vTwinklePhase;
  
  uniform float uTime;
  
  void main() {
    vBrightness = brightness;
    vTwinklePhase = twinklePhase;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Gentle twinkle
    float twinkle = 0.85 + 0.15 * sin(uTime * 1.5 + twinklePhase);
    
    gl_PointSize = size * twinkle * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying float vBrightness;
  varying float vTwinklePhase;
  
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uSharpness; // 0.0 = soft/diffuse, 1.0 = sharp/crisp
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    if (dist > 0.5) discard;
    
    // Adjustable falloff based on sharpness
    // Sharp: steeper falloff, smaller glow radius
    // Soft: gradual falloff, larger glow
    float falloffStart = mix(0.0, 0.15, uSharpness);
    float falloffEnd = mix(0.5, 0.35, uSharpness);
    float alpha = 1.0 - smoothstep(falloffStart, falloffEnd, dist);
    
    // Sharper exponent for mobile
    float exponent = mix(1.5, 2.5, uSharpness);
    alpha = pow(alpha, exponent);
    
    // Subtle twinkle
    float twinkle = 0.8 + 0.2 * sin(uTime * 1.2 + vTwinklePhase);
    
    vec3 color = uColor * vBrightness * twinkle;
    
    // Bright core - larger and brighter on sharp mode
    float coreSize = mix(0.2, 0.12, uSharpness);
    float coreStrength = mix(0.4, 0.7, uSharpness);
    float core = 1.0 - smoothstep(0.0, coreSize, dist);
    color += vec3(1.0) * core * coreStrength;
    
    gl_FragColor = vec4(color, alpha * vBrightness);
  }
`;

const Stars = ({ darkMode, mousePos, isMobile, blackHole }: { 
  darkMode: boolean; 
  mousePos: React.MutableRefObject<{ x: number; y: number }>; 
  isMobile: boolean;
  blackHole?: BlackHoleState;
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobile ? 350 : 500;
  
  // Store original positions for gravity effect
  const originalPositions = useRef<Float32Array | null>(null);
  
  const { positions, sizes, brightnesses, twinklePhases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const brightnesses = new Float32Array(count);
    const twinklePhases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = -8 - Math.random() * 15;
      
      sizes[i] = Math.random() * 3 + 1;
      brightnesses[i] = 0.4 + Math.random() * 0.6;
      twinklePhases[i] = Math.random() * Math.PI * 2;
    }
    
    // Store original positions
    originalPositions.current = new Float32Array(positions);
    
    return { positions, sizes, brightnesses, twinklePhases };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(darkMode ? '#ffffff' : '#ffeecc') },
    uSharpness: { value: isMobile ? 1.0 : 0.0 },
  }), []);

  useEffect(() => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uColor.value = new THREE.Color(darkMode ? '#ffffff' : '#ffeecc');
      material.uniforms.uSharpness.value = isMobile ? 1.0 : 0.0;
    }
  }, [darkMode, isMobile]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Parallax offset
    const parallaxX = mousePos.current.x * 0.15;
    const parallaxY = mousePos.current.y * 0.1;
    pointsRef.current.position.x = parallaxX;
    pointsRef.current.position.y = parallaxY;
    
    // Black hole gravity effect - continuous attraction while held
    const geometry = pointsRef.current.geometry;
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    
    if (blackHole?.active && originalPositions.current) {
      // Adjust black hole position to account for star parallax offset
      // Stars are in local space, so we need black hole position in that space
      const bhX = blackHole.position.x - parallaxX;
      const bhY = blackHole.position.y - parallaxY;
      
      for (let i = 0; i < count; i++) {
        // Get current position (not original - for continuous attraction)
        const cx = positionAttr.getX(i);
        const cy = positionAttr.getY(i);
        const oz = originalPositions.current[i * 3 + 2];
        
        // Calculate distance to black hole (in local star space)
        const dx = bhX - cx;
        const dy = bhY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Strong gravity - stars WILL reach the center
        const maxDist = 12;
        
        // Pull speed increases as stars get closer
        let pullSpeed = 0.04;
        if (dist < 5) pullSpeed = 0.08;
        if (dist < 3) pullSpeed = 0.12;
        if (dist < 1.5) pullSpeed = 0.18;
        if (dist < 0.5) pullSpeed = 0.35;
        
        // Only apply gravity within max distance
        if (dist < maxDist && dist > 0.35) {
          // Normalize direction
          const dirX = dx / dist;
          const dirY = dy / dist;
          
          // Move directly toward black hole center
          const moveX = dirX * pullSpeed * Math.min(dist, 1);
          const moveY = dirY * pullSpeed * Math.min(dist, 1);
          
          // Add slight spiral for visual interest
          const spiralStrength = 0.08 * pullSpeed;
          const perpX = -dirY * spiralStrength;
          const perpY = dirX * spiralStrength;
          
          positionAttr.setXYZ(i, cx + moveX + perpX, cy + moveY + perpY, oz);
        } else if (dist <= 0.35) {
          // Star reached event horizon - hide it
          positionAttr.setXYZ(i, bhX, bhY, -100);
        }
      }
      
      positionAttr.needsUpdate = true;
    } else if (originalPositions.current) {
      // Smoothly return to original positions when black hole is released
      let needsUpdate = false;
      
      for (let i = 0; i < count; i++) {
        const cx = positionAttr.getX(i);
        const cy = positionAttr.getY(i);
        const ox = originalPositions.current[i * 3];
        const oy = originalPositions.current[i * 3 + 1];
        const oz = originalPositions.current[i * 3 + 2];
        
        // Smooth return (lerp)
        const returnSpeed = 0.05;
        const newX = cx + (ox - cx) * returnSpeed;
        const newY = cy + (oy - cy) * returnSpeed;
        
        // Only update if significantly different
        if (Math.abs(newX - ox) > 0.001 || Math.abs(newY - oy) > 0.001) {
          positionAttr.setXYZ(i, newX, newY, oz);
          needsUpdate = true;
        } else {
          positionAttr.setXYZ(i, ox, oy, oz);
        }
      }
      
      if (needsUpdate) {
        positionAttr.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-brightness" count={count} array={brightnesses} itemSize={1} />
        <bufferAttribute attach="attributes-twinklePhase" count={count} array={twinklePhases} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ============================================
// CELESTIAL BODY (Sun/Moon) with proper glow
// ============================================
const moonVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const moonFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Noise functions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // Realistic crater - circular with bright rim and dark floor
  float crater(vec2 p, vec2 center, float size, float depth) {
    float d = length(p - center);
    float r = size;
    
    if (d > r * 1.3) return 0.0;
    
    float normalizedDist = d / r;
    
    // Sharp circular rim (bright ring)
    float rim = smoothstep(0.85, 0.95, normalizedDist) * (1.0 - smoothstep(0.95, 1.1, normalizedDist));
    rim *= 0.4 * depth;
    
    // Dark crater floor
    float floor = 1.0 - smoothstep(0.0, 0.75, normalizedDist);
    floor *= depth * 0.35;
    
    // Inner shadow near rim
    float innerShadow = smoothstep(0.6, 0.85, normalizedDist) * (1.0 - smoothstep(0.85, 0.95, normalizedDist));
    innerShadow *= depth * 0.2;
    
    // Central peak for larger craters
    float peak = (1.0 - smoothstep(0.0, 0.15, normalizedDist)) * depth * 0.15;
    
    return rim - floor - innerShadow + peak;
  }
  
  void main() {
    // Spherical UV mapping
    vec3 spherePos = normalize(vPosition);
    vec2 sphereUv = vec2(
      atan(spherePos.x, spherePos.z) / 6.28318 + 0.5,
      asin(spherePos.y) / 3.14159 + 0.5
    );
    
    // Base moon colors - more contrast
    vec3 highland = vec3(0.82, 0.8, 0.78);
    vec3 maria = vec3(0.38, 0.38, 0.42);
    
    // Maria (dark seas) - larger smoother areas
    float mariaPattern = fbm(sphereUv * 2.5);
    mariaPattern = smoothstep(0.4, 0.6, mariaPattern);
    
    // Base color
    vec3 color = mix(maria, highland, mariaPattern);
    
    // Surface roughness
    float roughness = fbm(sphereUv * 15.0) * 0.08;
    color *= 1.0 - roughness;
    
    // === CRATERS ===
    float craterEffect = 0.0;
    
    // Large impact craters (like Tycho, Copernicus)
    craterEffect += crater(sphereUv, vec2(0.25, 0.35), 0.12, 1.0);
    craterEffect += crater(sphereUv, vec2(0.72, 0.55), 0.1, 1.0);
    craterEffect += crater(sphereUv, vec2(0.45, 0.2), 0.09, 0.9);
    craterEffect += crater(sphereUv, vec2(0.15, 0.65), 0.08, 0.85);
    craterEffect += crater(sphereUv, vec2(0.8, 0.3), 0.07, 0.8);
    
    // Medium craters
    craterEffect += crater(sphereUv, vec2(0.55, 0.7), 0.055, 0.7);
    craterEffect += crater(sphereUv, vec2(0.35, 0.5), 0.05, 0.7);
    craterEffect += crater(sphereUv, vec2(0.65, 0.35), 0.045, 0.65);
    craterEffect += crater(sphereUv, vec2(0.4, 0.75), 0.04, 0.6);
    craterEffect += crater(sphereUv, vec2(0.2, 0.45), 0.04, 0.6);
    craterEffect += crater(sphereUv, vec2(0.75, 0.7), 0.035, 0.55);
    craterEffect += crater(sphereUv, vec2(0.6, 0.15), 0.035, 0.55);
    
    // Small craters
    craterEffect += crater(sphereUv, vec2(0.3, 0.6), 0.025, 0.45);
    craterEffect += crater(sphereUv, vec2(0.5, 0.45), 0.02, 0.4);
    craterEffect += crater(sphereUv, vec2(0.85, 0.5), 0.02, 0.4);
    craterEffect += crater(sphereUv, vec2(0.1, 0.3), 0.018, 0.35);
    craterEffect += crater(sphereUv, vec2(0.9, 0.65), 0.015, 0.3);
    craterEffect += crater(sphereUv, vec2(0.48, 0.58), 0.015, 0.3);
    
    // Apply crater shading
    color *= 1.0 + craterEffect;
    
    // Micro-texture
    float micro = noise(sphereUv * 80.0) * 0.04;
    color *= 1.0 - micro;
    
    // === LIGHTING ===
    vec3 lightDir = normalize(vec3(1.0, 0.2, 0.6));
    float NdotL = dot(vNormal, lightDir);
    float diffuse = max(NdotL, 0.0);
    diffuse = 0.15 + diffuse * 0.85;
    
    // Apply lighting
    color *= diffuse;
    
    // Terminator enhancement (sharper day/night)
    float terminator = smoothstep(-0.05, 0.2, NdotL);
    color *= 0.4 + terminator * 0.6;
    
    // Subtle blue rim
    float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    rim = pow(rim, 3.5);
    color += vec3(0.6, 0.65, 0.8) * rim * 0.12;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  uniform float uTime;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Noise functions
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float hash3(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  
  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
      mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x),
          mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
          mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  float fbm3(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise3(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    // Spherical coordinates
    vec3 spherePos = normalize(vPosition);
    vec2 sphereUv = vec2(
      atan(spherePos.x, spherePos.z) / 6.28318 + 0.5,
      asin(spherePos.y) / 3.14159 + 0.5
    );
    
    float time = uTime * 0.15;
    
    // === SUN COLORS ===
    vec3 white = vec3(1.0, 1.0, 0.95);
    vec3 yellow = vec3(1.0, 0.92, 0.5);
    vec3 orange = vec3(1.0, 0.65, 0.25);
    vec3 darkOrange = vec3(0.9, 0.4, 0.1);
    
    // === SOLAR GRANULATION (convection cells) ===
    float granulation = fbm3(vec3(spherePos * 8.0 + time * 0.3));
    float fineGranulation = fbm(sphereUv * 40.0 + time * 0.2) * 0.5;
    granulation = granulation * 0.7 + fineGranulation * 0.3;
    
    // === SOLAR PLASMA FLOW ===
    float flow1 = fbm3(vec3(spherePos * 3.0 + time * 0.5));
    float flow2 = fbm3(vec3(spherePos * 5.0 - time * 0.3 + 10.0));
    float plasma = flow1 * 0.6 + flow2 * 0.4;
    
    // === SUNSPOTS ===
    float spots = 0.0;
    // Large sunspot regions
    float spot1 = 1.0 - smoothstep(0.0, 0.08, length(sphereUv - vec2(0.3, 0.45)));
    float spot2 = 1.0 - smoothstep(0.0, 0.05, length(sphereUv - vec2(0.65, 0.5)));
    float spot3 = 1.0 - smoothstep(0.0, 0.04, length(sphereUv - vec2(0.5, 0.35)));
    spots = max(max(spot1, spot2), spot3) * 0.4;
    
    // === COLOR COMPOSITION ===
    // Base: bright yellow-white
    vec3 color = mix(yellow, white, 0.5);
    
    // Add orange variation based on plasma flow
    color = mix(color, orange, plasma * 0.35);
    
    // Granulation darkening
    color *= 0.92 + granulation * 0.16;
    
    // Sunspots (darker regions)
    color = mix(color, darkOrange * 0.5, spots);
    
    // === LIMB DARKENING ===
    float NdotV = max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    float limb = pow(NdotV, 0.35);
    
    // Edge gets more orange/red
    vec3 limbColor = mix(orange, yellow, limb);
    color = mix(limbColor * 0.85, color, limb);
    
    // === CORONA GLOW at edge ===
    float corona = 1.0 - NdotV;
    corona = pow(corona, 2.0);
    color += white * corona * 0.2;
    
    // === BRIGHTNESS PULSE ===
    float pulse = 0.98 + 0.02 * sin(uTime * 0.6);
    color *= pulse;
    
    // === FLARE HIGHLIGHTS ===
    float flare = fbm(vec2(atan(spherePos.y, spherePos.x) * 2.0 + time, time * 0.5));
    flare = pow(flare, 3.0) * corona * 0.15;
    color += white * flare;
    
    // Ensure brightness
    color = max(color, vec3(0.4, 0.25, 0.1));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Separate Moon component
const Moon = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.9, 48, 48]} />
      <shaderMaterial
        vertexShader={moonVertexShader}
        fragmentShader={moonFragmentShader}
      />
    </mesh>
  );
};

// Separate Sun component
const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useRef({ uTime: { value: 0 } });
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.3, 48, 48]} />
      <shaderMaterial
        vertexShader={sunVertexShader}
        fragmentShader={sunFragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

const CelestialBody = ({ darkMode, isMobile }: { darkMode: boolean; isMobile: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  const glowConfig = useMemo(() => {
    if (darkMode) {
      return {
        innerGlow: '#888899',
        outerGlow: '#556677',
      };
    } else {
      return {
        innerGlow: '#ffaa22',
        outerGlow: '#ff6622',
      };
    }
  }, [darkMode]);

  // Mobile: centered at top, Desktop: top-right
  const position: [number, number, number] = isMobile 
    ? [1.5, 3.2, -6]  // Mobile: upper right, visible but not blocking content
    : [3.5, 1.8, -6]; // Desktop: original position
  
  const scale = isMobile ? 0.85 : 1; // Slightly smaller on mobile

  useFrame((state) => {
    if (groupRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      groupRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <group ref={groupRef} position={position} key={darkMode ? 'moon' : 'sun'}>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshBasicMaterial 
          color={glowConfig.outerGlow} 
          transparent 
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Middle glow */}
      <mesh>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial 
          color={glowConfig.outerGlow} 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshBasicMaterial 
          color={glowConfig.innerGlow} 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Main body - using key to force recreation */}
      {darkMode ? <Moon key="moon-body" /> : <Sun key="sun-body" />}
    </group>
  );
};

// ============================================
// QUALITY PLANETS with texture effect
// ============================================
const planetVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const planetFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uSeed;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  
  float hash(vec2 p) {
    return fract(sin(dot(p + uSeed, vec2(127.1, 311.7))) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  
  void main() {
    // Surface texture
    float n = noise(vUv * 8.0) * 0.5 + noise(vUv * 16.0) * 0.25;
    
    // Color bands
    float bands = sin(vUv.y * 15.0 + n * 2.0) * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, bands);
    
    // Surface variation
    color *= 0.85 + n * 0.3;
    
    // Simple lighting
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diffuse = max(dot(vNormal, lightDir), 0.0);
    diffuse = 0.4 + diffuse * 0.6;
    color *= diffuse;
    
    // Rim light
    float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    rim = pow(rim, 3.0);
    color += uColor1 * rim * 0.3;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface PlanetConfig {
  position: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  color1: string;
  color2: string;
  seed: number;
  startAngle: number;
  hasRings?: boolean;
}

const Planet = ({ config, centerPos }: { config: PlanetConfig; centerPos: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uColor1: { value: new THREE.Color(config.color1) },
    uColor2: { value: new THREE.Color(config.color2) },
    uSeed: { value: config.seed },
  }), [config]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime * config.orbitSpeed + config.startAngle;
    // Orbit around the celestial body (sun/moon)
    groupRef.current.position.x = centerPos[0] + Math.cos(time) * config.orbitRadius;
    groupRef.current.position.y = centerPos[1] + Math.sin(time * 0.5) * config.orbitRadius * 0.3;
    groupRef.current.position.z = centerPos[2] + Math.sin(time) * config.orbitRadius * 0.4 - 2;
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[config.size * 1.3, 12, 12]} />
        <meshBasicMaterial 
          color={config.color1} 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Planet body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.size, 24, 24]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      {/* Rings if applicable */}
      {config.hasRings && (
        <mesh rotation={[Math.PI / 2.5, 0.2, 0]}>
          <ringGeometry args={[config.size * 1.5, config.size * 2.5, 32]} />
          <meshBasicMaterial
            color={config.color1}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

const Planets = ({ darkMode, isMobile }: { darkMode: boolean; isMobile: boolean }) => {
  // Center position (celestial body - sun/moon)
  const centerPos: [number, number, number] = isMobile 
    ? [1.5, 3.2, -6]  
    : [3.5, 1.8, -6];

  const configs: PlanetConfig[] = useMemo(() => {
    if (isMobile) {
      // Mobile: smaller orbits and planets for vertical screen
      return [
        {
          // Mars - red planet, closest orbit
          position: [0, 0, 0],
          orbitRadius: 1.8,
          orbitSpeed: 0.15,
          size: 0.15,
          color1: '#cc4422',
          color2: '#aa3311',
          seed: 4.0,
          startAngle: 0,
        },
        {
          // Saturn with rings - medium orbit
          position: [0, 0, 0],
          orbitRadius: 3,
          orbitSpeed: 0.08,
          size: 0.25,
          color1: darkMode ? '#aa8866' : '#ddaa55',
          color2: darkMode ? '#887755' : '#cc9944',
          seed: 2.0,
          startAngle: 2.0,
          hasRings: true,
        },
        {
          // Blue/purple planet - outer orbit
          position: [0, 0, 0],
          orbitRadius: 4.2,
          orbitSpeed: 0.05,
          size: 0.18,
          color1: darkMode ? '#5577cc' : '#cc4433',
          color2: darkMode ? '#3355aa' : '#ff6644',
          seed: 1.0,
          startAngle: 4.2,
        },
      ];
    }
    
    // Desktop: planets orbiting around the celestial body
    return [
      {
        // Mars - red planet, closest orbit
        position: [0, 0, 0],
        orbitRadius: 3.5,
        orbitSpeed: 0.1,
        size: 0.3,
        color1: '#cc4422',
        color2: '#aa3311',
        seed: 4.0,
        startAngle: 1.0,
      },
      {
        // Blue planet - medium orbit
        position: [0, 0, 0],
        orbitRadius: 5.5,
        orbitSpeed: 0.07,
        size: 0.35,
        color1: darkMode ? '#5577cc' : '#6688dd',
        color2: darkMode ? '#3355aa' : '#4466bb',
        seed: 1.0,
        startAngle: 3.5,
      },
      {
        // Saturn with rings - outer orbit
        position: [0, 0, 0],
        orbitRadius: 8,
        orbitSpeed: 0.04,
        size: 0.55,
        color1: darkMode ? '#aa8866' : '#ddaa55',
        color2: darkMode ? '#887755' : '#cc9944',
        seed: 2.0,
        startAngle: 5.5,
        hasRings: true,
      },
      {
        // Small green/teal planet - furthest orbit
        position: [0, 0, 0],
        orbitRadius: 10,
        orbitSpeed: 0.025,
        size: 0.22,
        color1: darkMode ? '#55aa99' : '#bb3355',
        color2: darkMode ? '#44cc88' : '#ff5577',
        seed: 3.0,
        startAngle: 0.5,
      },
    ];
  }, [darkMode, isMobile]);

  return (
    <>
      {configs.map((config, i) => (
        <Planet key={i} config={config} centerPos={centerPos} />
      ))}
    </>
  );
};

// ============================================
// SHOOTING STARS
// ============================================
const ShootingStar = ({ darkMode, delay }: { darkMode: boolean; delay: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const state = useRef({
    active: false,
    startX: 0,
    startY: 0,
    nextTrigger: delay,
  });

  useFrame((clock) => {
    if (!meshRef.current) return;
    
    const time = clock.clock.elapsedTime;
    
    if (!state.current.active && time > state.current.nextTrigger) {
      state.current.active = true;
      state.current.startX = -5 + Math.random() * 3;
      state.current.startY = 3 + Math.random() * 2;
    }
    
    if (state.current.active) {
      const progress = (time - state.current.nextTrigger) / 0.5;
      
      if (progress <= 1) {
        meshRef.current.visible = true;
        
        const x = state.current.startX + progress * 7;
        const y = state.current.startY - progress * 4;
        
        meshRef.current.position.set(x, y, -5);
        meshRef.current.rotation.z = -0.5;
        
        const scale = Math.max(0, 1 - progress);
        meshRef.current.scale.set(scale * 1.5, scale * 0.05, 1);
        
        (meshRef.current.material as THREE.MeshBasicMaterial).opacity = scale * 0.8;
      } else {
        meshRef.current.visible = false;
        state.current.active = false;
        state.current.nextTrigger = time + 8 + Math.random() * 15;
      }
    }
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={darkMode ? '#ffffff' : '#ffeeaa'}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// ============================================
// BLACK HOLE - Touch interaction (Gravitational Lensing)
// ============================================
interface BlackHoleState {
  active: boolean;
  position: THREE.Vector3;
  startTime: number;
  strength: number;
}

// Shader for gravitational lensing distortion effect
const distortionVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const distortionFragmentShader = `
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;
  
  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    float angle = atan(center.y, center.x);
    
    // === SPINNING SPIRAL RING ===
    // Create spiral distortion that rotates with time
    float spiral = angle + uTime * 1.5;
    
    // Ring with spiral thickness variation (creates the spinning look)
    float ringBase = smoothstep(0.16, 0.20, dist) * (1.0 - smoothstep(0.24, 0.35, dist));
    
    // Spiral brightness variation - makes it look like it's spinning
    float spiralWave = sin(spiral * 2.0 + dist * 8.0) * 0.5 + 0.5;
    float spiralWave2 = sin(spiral * 3.0 - dist * 5.0) * 0.5 + 0.5;
    
    // Combine for dynamic spinning effect
    float ring = ringBase * (0.5 + spiralWave * 0.3 + spiralWave2 * 0.2);
    
    // Brighter streak (the bright part of the spiral)
    float streak = pow(spiralWave, 3.0) * ringBase * 1.5;
    
    // === COLORS - Orange/Gold/White gradient ===
    vec3 darkOrange = vec3(1.0, 0.4, 0.1);
    vec3 brightOrange = vec3(1.0, 0.65, 0.2);
    vec3 yellow = vec3(1.0, 0.9, 0.5);
    vec3 white = vec3(1.0, 0.98, 0.95);
    
    // Color varies with the spiral
    vec3 color = mix(darkOrange, brightOrange, spiralWave) * ring * 1.8;
    color += mix(brightOrange, yellow, spiralWave2) * streak;
    
    // Hot white highlights on brightest parts
    color += white * pow(streak, 2.0) * 0.8;
    
    float alpha = (ring + streak * 0.5) * uStrength;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const BlackHole = ({ blackHole, mousePos }: { blackHole: BlackHoleState; mousePos: React.MutableRefObject<{ x: number; y: number }> }) => {
  const groupRef = useRef<THREE.Group>(null);
  const distortionRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0);
  const strengthRef = useRef(0);
  
  const uniforms = useRef({
    uTime: { value: 0 },
    uStrength: { value: 0 },
  });

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth scale transition
    const targetScale = blackHole.active ? 1 : 0;
    scaleRef.current += (targetScale - scaleRef.current) * 0.12;
    
    // Smooth strength for shader
    const targetStrength = blackHole.active ? 1 : 0;
    strengthRef.current += (targetStrength - strengthRef.current) * 0.1;
    uniforms.current.uStrength.value = strengthRef.current;
    uniforms.current.uTime.value = state.clock.elapsedTime;
    
    // Pulse effect while active
    const pulse = blackHole.active ? (0.95 + Math.sin(state.clock.elapsedTime * 5) * 0.05) : 1;
    groupRef.current.scale.setScalar(scaleRef.current * pulse);
    
    // Position must match where stars calculate gravity
    // Stars are offset by parallax, so black hole visual must be too
    const parallaxX = mousePos.current.x * 0.15;
    const parallaxY = mousePos.current.y * 0.1;
    groupRef.current.position.set(
      blackHole.position.x - parallaxX,
      blackHole.position.y - parallaxY,
      blackHole.position.z
    );
    
    groupRef.current.visible = scaleRef.current > 0.01;
  });

  return (
    <group ref={groupRef}>
      {/* Spinning ring glow */}
      <mesh ref={distortionRef}>
        <planeGeometry args={[2.8, 2.8]} />
        <shaderMaterial
          vertexShader={distortionVertexShader}
          fragmentShader={distortionFragmentShader}
          uniforms={uniforms.current}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* BLACK CENTER - event horizon (matches star disappear radius) */}
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.4, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};

// ============================================
// FOCAL STARS - Large bright stars
// ============================================
const FocalStars = ({ darkMode, isMobile }: { darkMode: boolean; isMobile: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const stars = useMemo(() => {
    if (isMobile) {
      // Mobile: distributed for vertical screen, avoid center where text is
      return [
        { pos: [-2.5, 4.5, -8], size: 0.07, color: darkMode ? '#aaccff' : '#ffddaa' },
        { pos: [2.8, -4, -9], size: 0.06, color: darkMode ? '#ffccaa' : '#ffeecc' },
        { pos: [-2, -3.5, -10], size: 0.05, color: darkMode ? '#aaffee' : '#ffccaa' },
        { pos: [1.5, 5, -11], size: 0.055, color: darkMode ? '#ddaaff' : '#ffeedd' },
        { pos: [-3, 0.5, -7], size: 0.04, color: darkMode ? '#ffffff' : '#ffffee' },
        { pos: [3, -1.5, -8], size: 0.045, color: darkMode ? '#aaddff' : '#ffddbb' },
        { pos: [-1.5, -5.5, -9], size: 0.05, color: darkMode ? '#ccddff' : '#ffeebb' },
        { pos: [2, 2, -10], size: 0.035, color: darkMode ? '#eeddff' : '#ffddcc' },
      ];
    }
    
    // Desktop: original
    return [
      { pos: [-6, 3, -8], size: 0.08, color: darkMode ? '#aaccff' : '#ffddaa' },
      { pos: [5, -2, -10], size: 0.06, color: darkMode ? '#ffccaa' : '#ffeecc' },
      { pos: [-3, -3, -9], size: 0.05, color: darkMode ? '#aaffee' : '#ffccaa' },
      { pos: [7, 2.5, -11], size: 0.07, color: darkMode ? '#ddaaff' : '#ffeedd' },
      { pos: [-5, 1, -7], size: 0.04, color: darkMode ? '#ffffff' : '#ffffee' },
      { pos: [2, 4, -12], size: 0.05, color: darkMode ? '#aaddff' : '#ffddbb' },
    ];
  }, [darkMode, isMobile]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const pulse = 0.9 + 0.1 * Math.sin(state.clock.elapsedTime * (1 + i * 0.3) + i);
        mesh.scale.setScalar(pulse);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {stars.map((star, i) => (
        <group key={i} position={star.pos as [number, number, number]}>
          {/* Glow */}
          <mesh>
            <sphereGeometry args={[star.size * 3, 8, 8]} />
            <meshBasicMaterial color={star.color} transparent opacity={0.15} />
          </mesh>
          {/* Core */}
          <mesh>
            <sphereGeometry args={[star.size, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ============================================
// CONSTELLATIONS - Realistic patterns
// ============================================
type Point3D = [number, number, number];

interface ConstellationStar {
  pos: Point3D;
  size: number;
  brightness: number;
}

interface ConstellationData {
  stars: ConstellationStar[];
  lines: [number, number][]; // indices connecting stars
  offset: Point3D;
  scale: number;
}

const ConstellationLine = ({ start, end, darkMode }: { start: Point3D; end: Point3D; darkMode: boolean }) => {
  const { position, rotation, length } = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    const len = s.distanceTo(e);
    const dir = new THREE.Vector3().subVectors(e, s).normalize();
    const rot = Math.atan2(dir.y, dir.x);
    return { position: mid, rotation: rot, length: len };
  }, [start, end]);

  return (
    <mesh position={position} rotation={[0, 0, rotation]}>
      <planeGeometry args={[length, 0.015]} />
      <meshBasicMaterial 
        color={darkMode ? '#6699dd' : '#aa8855'} 
        transparent 
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const Constellation = ({ data, darkMode }: { data: ConstellationData; darkMode: boolean }) => {
  const transformedStars = useMemo(() => {
    return data.stars.map(star => ({
      ...star,
      pos: [
        star.pos[0] * data.scale + data.offset[0],
        star.pos[1] * data.scale + data.offset[1],
        star.pos[2] + data.offset[2],
      ] as Point3D,
    }));
  }, [data]);

  return (
    <group>
      {/* Lines connecting stars */}
      {data.lines.map(([i, j], idx) => (
        <ConstellationLine
          key={`line-${idx}`}
          start={transformedStars[i].pos}
          end={transformedStars[j].pos}
          darkMode={darkMode}
        />
      ))}
      {/* Stars with varying sizes */}
      {transformedStars.map((star, i) => (
        <group key={`star-${i}`} position={star.pos}>
          {/* Outer glow */}
          <mesh>
            <sphereGeometry args={[star.size * 4, 6, 6]} />
            <meshBasicMaterial 
              color={darkMode ? '#88aaff' : '#ffdd88'} 
              transparent 
              opacity={star.brightness * 0.25}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Inner glow */}
          <mesh>
            <sphereGeometry args={[star.size * 2, 6, 6]} />
            <meshBasicMaterial 
              color={darkMode ? '#aaccff' : '#ffeeaa'} 
              transparent 
              opacity={star.brightness * 0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Bright core */}
          <mesh>
            <sphereGeometry args={[star.size, 8, 8]} />
            <meshBasicMaterial 
              color="#ffffff"
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Constellations = ({ darkMode }: { darkMode: boolean }) => {
  const constellations = useMemo<ConstellationData[]>(() => [
    // ORION - Simple hourglass: 4 corners + 3 belt stars
    {
      stars: [
        // Four corners (rectangle)
        { pos: [0.7, 1.0, 0], size: 0.05, brightness: 1.0 },    // 0: Betelgeuse - top left
        { pos: [-0.7, 1.0, 0], size: 0.035, brightness: 0.85 }, // 1: Bellatrix - top right
        { pos: [0.5, -1.0, 0], size: 0.03, brightness: 0.75 },  // 2: Saiph - bottom left
        { pos: [-0.6, -1.0, 0], size: 0.045, brightness: 0.95 },// 3: Rigel - bottom right
        // Belt (3 stars in a row)
        { pos: [0.2, 0, 0], size: 0.028, brightness: 0.85 },    // 4: Alnitak
        { pos: [0, 0, 0], size: 0.03, brightness: 0.9 },        // 5: Alnilam
        { pos: [-0.2, 0, 0], size: 0.026, brightness: 0.8 },    // 6: Mintaka
      ],
      lines: [
        // Shoulders to belt
        [0, 4], [1, 6],
        // Belt
        [4, 5], [5, 6],
        // Belt to feet
        [4, 2], [6, 3],
      ],
      offset: [-9, -2.5, -11],
      scale: 1.5,
    },
    // BIG DIPPER - Simple: bowl + handle
    {
      stars: [
        // Bowl (4 stars - trapezoid)
        { pos: [0, 0, 0], size: 0.035, brightness: 0.9 },       // 0: Dubhe
        { pos: [0, -0.5, 0], size: 0.032, brightness: 0.85 },   // 1: Merak
        { pos: [-0.6, -0.45, 0], size: 0.028, brightness: 0.75 },// 2: Phecda
        { pos: [-0.55, 0.05, 0], size: 0.022, brightness: 0.6 },// 3: Megrez
        // Handle (3 stars - slight arc)
        { pos: [-1.0, 0.15, 0], size: 0.03, brightness: 0.85 }, // 4: Alioth
        { pos: [-1.45, 0.25, 0], size: 0.028, brightness: 0.8 },// 5: Mizar
        { pos: [-1.9, 0.2, 0], size: 0.025, brightness: 0.75 }, // 6: Alkaid
      ],
      lines: [
        // Bowl
        [0, 1], [1, 2], [2, 3], [3, 0],
        // Handle
        [3, 4], [4, 5], [5, 6],
      ],
      offset: [8, 4, -12],
      scale: 1.1,
    },
    // CASSIOPEIA - Clear W shape
    {
      stars: [
        { pos: [0.8, -0.2, 0], size: 0.028, brightness: 0.8 },  // 0: Caph
        { pos: [0.4, 0.3, 0], size: 0.032, brightness: 0.9 },   // 1: Schedar
        { pos: [0, -0.15, 0], size: 0.03, brightness: 0.85 },   // 2: Navi
        { pos: [-0.4, 0.25, 0], size: 0.026, brightness: 0.75 },// 3: Ruchbah
        { pos: [-0.8, -0.1, 0], size: 0.024, brightness: 0.7 }, // 4: Segin
      ],
      lines: [
        [0, 1], [1, 2], [2, 3], [3, 4], // W shape
      ],
      offset: [-6, 4.5, -13],
      scale: 1.4,
    },
  ], []);

  return (
    <group>
      {constellations.map((constellation, i) => (
        <Constellation key={i} data={constellation} darkMode={darkMode} />
      ))}
    </group>
  );
};

// ============================================
// CAMERA with improved depth parallax
// ============================================
const Camera = ({ mousePos, gyroPos, isMobile }: { 
  mousePos: React.MutableRefObject<{ x: number; y: number }>; 
  gyroPos: React.MutableRefObject<{ x: number; y: number }>;
  isMobile: boolean;
}) => {
  const { camera } = useThree();

  useFrame(() => {
    if (isMobile) {
      // Gyroscope-based parallax for mobile
      camera.position.x += (gyroPos.current.x * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (gyroPos.current.y * 0.6 - camera.position.y) * 0.05;
      
      // Subtle rotation based on gyro
      camera.rotation.y = gyroPos.current.x * 0.03;
      camera.rotation.x = -gyroPos.current.y * 0.02;
    } else {
      // Enhanced parallax for depth effect (desktop)
      camera.position.x += (mousePos.current.x * 0.6 - camera.position.x) * 0.025;
      camera.position.y += (mousePos.current.y * 0.4 - camera.position.y) * 0.025;
      
      // Subtle rotation for more depth
      camera.rotation.y = mousePos.current.x * 0.02;
      camera.rotation.x = -mousePos.current.y * 0.015;
    }
  });

  return null;
};

// ============================================
// SCENE
// ============================================
const SpaceScene = ({ darkMode, isMobile, gyroEnabled, blackHole }: SpaceBackgroundProps & { 
  isMobile: boolean; 
  gyroEnabled: boolean;
  blackHole: BlackHoleState;
}) => {
  const mousePos = useRef({ x: 0, y: 0 });
  const gyroPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile && gyroEnabled) {
      // Gyroscope handling for mobile
      const handleOrientation = (event: DeviceOrientationEvent) => {
        // gamma: left-right tilt (-90 to 90)
        // beta: front-back tilt (-180 to 180)
        const gamma = event.gamma || 0;
        const beta = event.beta || 0;
        
        // Normalize to -1 to 1 range with sensitivity adjustment
        gyroPos.current.x = Math.max(-1, Math.min(1, gamma / 30));
        gyroPos.current.y = Math.max(-1, Math.min(1, (beta - 45) / 30)); // 45 is neutral holding angle
      };

      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    } else if (!isMobile) {
      // Mouse tracking for desktop
      const handleMouseMove = (event: MouseEvent) => {
        mousePos.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
        mousePos.current.y = -(event.clientY / window.innerHeight - 0.5) * 2;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isMobile, gyroEnabled]);

  return (
    <>
      {/* Camera always enabled - gyro on mobile, mouse parallax on desktop */}
      <Camera mousePos={mousePos} gyroPos={gyroPos} isMobile={isMobile} />
      <FullscreenNebula darkMode={darkMode} />
      {/* Constellations only on desktop (too many elements) */}
      {!isMobile && <Constellations darkMode={darkMode} />}
      <Stars darkMode={darkMode} mousePos={mousePos} isMobile={isMobile} blackHole={blackHole} />
      {/* Focal stars - mobile-optimized positions */}
      <FocalStars darkMode={darkMode} isMobile={isMobile} />
      {/* Celestial body - repositioned for mobile */}
      <CelestialBody darkMode={darkMode} isMobile={isMobile} />
      {/* Planets - mobile-specific configuration */}
      <Planets darkMode={darkMode} isMobile={isMobile} />
      {/* Black hole - touch interaction */}
      <BlackHole blackHole={blackHole} mousePos={mousePos} />
      {/* Shooting stars - one on mobile, two on desktop */}
      <ShootingStar darkMode={darkMode} delay={isMobile ? 5 : 3} />
      {!isMobile && <ShootingStar darkMode={darkMode} delay={10} />}
    </>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const SpaceBackground = ({ darkMode }: SpaceBackgroundProps) => {
  const isMobile = useIsMobile();
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [showGyroPrompt, setShowGyroPrompt] = useState(false);
  const [blackHole, setBlackHole] = useState<BlackHoleState>({
    active: false,
    position: new THREE.Vector3(0, 0, -5),
    startTime: 0,
    strength: 1,
  });
  const clockRef = useRef(0);

  // Update clock reference
  useEffect(() => {
    const interval = setInterval(() => {
      clockRef.current += 0.016; // ~60fps
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // No auto-deactivate - black hole stays while pressing

  // Check if gyroscope permission is needed (iOS)
  useEffect(() => {
    if (isMobile) {
      const needsPermission = typeof (DeviceOrientationEvent as any).requestPermission === 'function';
      if (needsPermission) {
        setShowGyroPrompt(true);
      } else {
        setGyroEnabled(true);
      }
    }
  }, [isMobile]);

  const requestGyroPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setGyroEnabled(true);
        }
      } catch (e) {
        console.log('Gyroscope permission denied');
      }
    }
    setShowGyroPrompt(false);
  };

  // Convert screen coordinates to 3D world position
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const fov = isMobile ? 65 : 60;
    const aspect = window.innerWidth / window.innerHeight;
    const distance = 10;
    
    const vFov = (fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFov / 2) * distance;
    const width = height * aspect;
    
    const normalizedX = (clientX / window.innerWidth) - 0.5;
    const normalizedY = -((clientY / window.innerHeight) - 0.5);
    
    return new THREE.Vector3(normalizedX * width, normalizedY * height, -5);
  }, [isMobile]);

  // Handle press start - create black hole
  const handlePressStart = useCallback((clientX: number, clientY: number) => {
    if (showGyroPrompt) {
      requestGyroPermission();
      return;
    }
    
    setBlackHole({
      active: true,
      position: screenToWorld(clientX, clientY),
      startTime: clockRef.current,
      strength: 1,
    });
  }, [showGyroPrompt, screenToWorld]);

  // Handle press end - deactivate black hole
  const handlePressEnd = useCallback(() => {
    setBlackHole(prev => ({ ...prev, active: false }));
  }, []);

  // Handle press move - update black hole position
  const handlePressMove = useCallback((clientX: number, clientY: number) => {
    if (blackHole.active) {
      setBlackHole(prev => ({
        ...prev,
        position: screenToWorld(clientX, clientY),
      }));
    }
  }, [blackHole.active, screenToWorld]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePressStart(touch.clientX, touch.clientY);
  }, [handlePressStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePressMove(touch.clientX, touch.clientY);
  }, [handlePressMove]);

  const handleTouchEnd = useCallback(() => {
    handlePressEnd();
  }, [handlePressEnd]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handlePressStart(e.clientX, e.clientY);
  }, [handlePressStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handlePressMove(e.clientX, e.clientY);
  }, [handlePressMove]);

  const handleMouseUp = useCallback(() => {
    handlePressEnd();
  }, [handlePressEnd]);
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: darkMode ? '#020015' : '#0a1a30',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Gyro permission prompt for iOS */}
      {showGyroPrompt && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          padding: '12px 20px',
          borderRadius: '12px',
          color: 'white',
          fontSize: '14px',
          zIndex: 100,
          textAlign: 'center',
          cursor: 'pointer',
        }}>
          Tap to enable motion effects
        </div>
      )}
      <Canvas
        key={`${darkMode ? 'dark' : 'light'}-${isMobile ? 'mobile' : 'desktop'}`}
        camera={{ position: [0, 0, 5], fov: isMobile ? 65 : 60 }}
        style={{ 
          display: 'block',
          width: '100%', 
          height: '100%',
        }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={isMobile ? Math.min(window.devicePixelRatio, 2) : [1, 2]}
        frameloop="always"
        flat
      >
        <SpaceScene darkMode={darkMode} isMobile={isMobile} gyroEnabled={gyroEnabled} blackHole={blackHole} />
      </Canvas>
    </div>
  );
};

export default SpaceBackground;
