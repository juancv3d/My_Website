import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FluidBackgroundProps {
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

// Vertex shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader - Organic Lava Lamp
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform vec3 uBlobColor;
  uniform vec3 uBackgroundColor;
  uniform vec3 uGlowColor;
  uniform float uMouseActive;
  
  // Click-spawned blobs (up to 8)
  uniform vec2 uClickBlobs[8];
  uniform float uClickTimes[8];
  
  varying vec2 vUv;
  
  // Noise functions for organic movement
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  // Metaball with smoother falloff
  float metaball(vec2 p, vec2 center, float radius) {
    float d = length(p - center);
    return (radius * radius) / (d * d + 0.0001);
  }
  
  // Organic lava motion with noise
  vec2 lavaMotion(float seed, float time) {
    float t = time * 0.4;
    float noiseSeed = seed * 100.0;
    
    // Base cycle movement (up and down like real lava)
    float cycle = sin(t * 0.3 + seed * 6.28);
    float y = cycle * 0.4;
    
    // Add organic noise to position
    float noiseX = snoise(vec2(t * 0.2 + noiseSeed, seed * 10.0)) * 0.15;
    float noiseY = snoise(vec2(t * 0.15 + noiseSeed + 50.0, seed * 10.0)) * 0.1;
    
    // Horizontal wobble
    float x = sin(t * 0.25 + seed * 3.14) * 0.2 + noiseX;
    y += noiseY;
    
    return vec2(x, y);
  }
  
  // Dynamic blob size (breathing effect)
  float dynamicSize(float baseSize, float seed, float time) {
    float breathe = sin(time * 0.5 + seed * 10.0) * 0.3 + 1.0;
    float pulse = sin(time * 1.2 + seed * 5.0) * 0.1 + 1.0;
    return baseSize * breathe * pulse;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;
    vec2 mousePos = (uMouse - 0.5) * aspect;
    
    float time = uTime;
    float blobs = 0.0;
    
    // Mouse heat zone - blobs near mouse grow
    float mouseDist;
    float heatBoost;
    
    // Large primary blobs
    vec2 b1 = lavaMotion(0.0, time) + vec2(-0.1, 0.0);
    mouseDist = length(b1 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.8;
    blobs += metaball(p, b1, dynamicSize(0.065, 0.0, time) * heatBoost);
    
    vec2 b2 = lavaMotion(0.2, time) + vec2(0.15, 0.1);
    mouseDist = length(b2 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.8;
    blobs += metaball(p, b2, dynamicSize(0.06, 0.2, time) * heatBoost);
    
    vec2 b3 = lavaMotion(0.4, time) + vec2(-0.2, -0.15);
    mouseDist = length(b3 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.8;
    blobs += metaball(p, b3, dynamicSize(0.055, 0.4, time) * heatBoost);
    
    // Medium blobs
    vec2 b4 = lavaMotion(0.55, time) + vec2(0.25, -0.05);
    mouseDist = length(b4 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.7;
    blobs += metaball(p, b4, dynamicSize(0.048, 0.55, time) * heatBoost);
    
    vec2 b5 = lavaMotion(0.7, time) + vec2(-0.3, 0.2);
    mouseDist = length(b5 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.7;
    blobs += metaball(p, b5, dynamicSize(0.045, 0.7, time) * heatBoost);
    
    vec2 b6 = lavaMotion(0.85, time) + vec2(0.05, 0.25);
    mouseDist = length(b6 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.7;
    blobs += metaball(p, b6, dynamicSize(0.042, 0.85, time) * heatBoost);
    
    // Small accent blobs
    vec2 b7 = lavaMotion(0.1, time * 1.3) + vec2(0.35, 0.1);
    mouseDist = length(b7 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.6;
    blobs += metaball(p, b7, dynamicSize(0.035, 0.1, time) * heatBoost);
    
    vec2 b8 = lavaMotion(0.3, time * 1.2) + vec2(-0.4, -0.2);
    mouseDist = length(b8 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.6;
    blobs += metaball(p, b8, dynamicSize(0.032, 0.3, time) * heatBoost);
    
    vec2 b9 = lavaMotion(0.5, time * 1.4) + vec2(0.1, -0.35);
    mouseDist = length(b9 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.6;
    blobs += metaball(p, b9, dynamicSize(0.03, 0.5, time) * heatBoost);
    
    vec2 b10 = lavaMotion(0.65, time * 1.25) + vec2(-0.15, 0.38);
    mouseDist = length(b10 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.5, 0.0, mouseDist) * 0.6;
    blobs += metaball(p, b10, dynamicSize(0.028, 0.65, time) * heatBoost);
    
    // Tiny floating particles
    vec2 b11 = lavaMotion(0.15, time * 1.6) + vec2(0.42, 0.25);
    blobs += metaball(p, b11, dynamicSize(0.022, 0.15, time));
    
    vec2 b12 = lavaMotion(0.35, time * 1.5) + vec2(-0.38, 0.32);
    blobs += metaball(p, b12, dynamicSize(0.02, 0.35, time));
    
    vec2 b13 = lavaMotion(0.75, time * 1.7) + vec2(0.28, -0.4);
    blobs += metaball(p, b13, dynamicSize(0.018, 0.75, time));
    
    vec2 b14 = lavaMotion(0.95, time * 1.55) + vec2(-0.32, -0.38);
    blobs += metaball(p, b14, dynamicSize(0.016, 0.95, time));
    
    // Click-spawned blobs
    for (int i = 0; i < 8; i++) {
      float clickAge = time - uClickTimes[i];
      if (clickAge > 0.0 && clickAge < 10.0) {
        vec2 clickPos = uClickBlobs[i];
        
        float rise = clickAge * 0.08 * (1.0 + snoise(vec2(clickAge, float(i))) * 0.3);
        float wobbleX = snoise(vec2(clickAge * 2.0, float(i) * 10.0)) * 0.08;
        float wobbleY = snoise(vec2(clickAge * 1.5 + 50.0, float(i) * 10.0)) * 0.04;
        
        vec2 blobPos = (clickPos - 0.5) * aspect;
        blobPos += vec2(wobbleX, rise + wobbleY);
        
        float growPhase = smoothstep(0.0, 1.5, clickAge);
        float shrinkPhase = smoothstep(10.0, 6.0, clickAge);
        float size = 0.05 * growPhase * shrinkPhase;
        size *= 1.0 + sin(clickAge * 2.0) * 0.2;
        
        // Heat boost for click blobs
        mouseDist = length(blobPos - mousePos);
        heatBoost = 1.0 + uMouseActive * smoothstep(0.4, 0.0, mouseDist) * 0.6;
        
        blobs += metaball(p, blobPos, size * heatBoost);
      }
    }
    
    // Threshold
    float threshold = 0.9;
    float edge = smoothstep(threshold - 0.2, threshold + 0.1, blobs);
    float glow = smoothstep(threshold - 0.5, threshold - 0.1, blobs);
    float innerGlow = smoothstep(threshold, threshold + 0.4, blobs);
    float highlight = smoothstep(threshold + 0.3, threshold + 0.8, blobs);
    
    // Color
    vec3 color = uBackgroundColor;
    
    // Mouse proximity for heat effects
    float mouseDistToPixel = length(p - mousePos);
    float nearMouse = smoothstep(0.5, 0.0, mouseDistToPixel) * uMouseActive;
    
    // Heat glow around mouse (visible warm zone)
    vec3 heatZoneColor = uGlowColor * 1.5 + vec3(0.1, 0.05, 0.0);
    color = mix(color, heatZoneColor, nearMouse * 0.25);
    
    // Outer glow
    color = mix(color, uGlowColor, glow * 0.5);
    
    // Main blob body
    color = mix(color, uBlobColor, edge);
    
    // Inner glow for depth
    color = mix(color, uBlobColor * 1.3, innerGlow * 0.5);
    
    // Hot center
    vec3 hotColor = uBlobColor * 1.8 + vec3(0.25, 0.15, 0.1);
    color = mix(color, hotColor, highlight * 0.7);
    
    // HEAT EFFECT: Extra brightness on blobs near mouse
    vec3 superHotColor = uBlobColor * 2.5 + vec3(0.4, 0.25, 0.15);
    float heatGlow = edge * nearMouse;
    color = mix(color, superHotColor, heatGlow * 0.8);
    
    // Add emissive glow when near mouse
    color += uBlobColor * 0.5 * edge * nearMouse;
    color += vec3(0.15, 0.1, 0.05) * edge * nearMouse;
    
    // Heat from bottom (lava lamp heat source)
    float bottomHeat = smoothstep(-0.5, 0.5, -p.y) * 0.08;
    color += uGlowColor * bottomHeat * edge;
    
    // Vignette
    color *= 1.0 - length(uv - 0.5) * 0.25;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface ClickBlob {
  x: number;
  y: number;
  time: number;
}

interface FluidMeshProps {
  darkMode: boolean;
  clickBlobs: ClickBlob[];
}

const FluidMesh = ({ darkMode, clickBlobs }: FluidMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: 0 });
  const { size, viewport } = useThree();
  
  // Colors based on mode
  const colors = useMemo(() => {
    if (darkMode) {
      return {
        blob: new THREE.Color('#00aaff'),      // Brighter blue
        background: new THREE.Color('#020206'),
        glow: new THREE.Color('#0077dd'),      // Stronger glow
      };
    } else {
      return {
        blob: new THREE.Color('#3399ff'),
        background: new THREE.Color('#f5faff'),
        glow: new THREE.Color('#66aaee'),
      };
    }
  }, [darkMode]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uBlobColor: { value: colors.blob },
    uBackgroundColor: { value: colors.background },
    uGlowColor: { value: colors.glow },
    uMouseActive: { value: 0 },
    uClickBlobs: { value: Array(8).fill(new THREE.Vector2(0, 0)) },
    uClickTimes: { value: Array(8).fill(-100) },
  }), []);

  // Update colors when darkMode changes
  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uBlobColor.value = colors.blob;
      material.uniforms.uBackgroundColor.value = colors.background;
      material.uniforms.uGlowColor.value = colors.glow;
    }
  }, [colors]);

  // Update click blobs
  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      const positions = clickBlobs.slice(-8).map(b => new THREE.Vector2(b.x, b.y));
      const times = clickBlobs.slice(-8).map(b => b.time);
      
      // Pad arrays to length 8
      while (positions.length < 8) {
        positions.push(new THREE.Vector2(0, 0));
        times.push(-100);
      }
      
      material.uniforms.uClickBlobs.value = positions;
      material.uniforms.uClickTimes.value = times;
    }
  }, [clickBlobs]);

  // Mouse handlers
  useEffect(() => {
    let fadeTimeout: number;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX / window.innerWidth;
      mouseRef.current.y = 1 - event.clientY / window.innerHeight;
      mouseRef.current.active = 1;
      
      clearTimeout(fadeTimeout);
      fadeTimeout = window.setTimeout(() => {
        mouseRef.current.active = 0;
      }, 1500);
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(fadeTimeout);
    };
  }, []);

  // Animation frame
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uResolution.value.set(size.width, size.height);
      
      // Smooth mouse tracking
      const currentMouse = material.uniforms.uMouse.value;
      currentMouse.x += (mouseRef.current.x - currentMouse.x) * 0.06;
      currentMouse.y += (mouseRef.current.y - currentMouse.y) * 0.06;
      
      material.uniforms.uMouseActive.value += 
        (mouseRef.current.active - material.uniforms.uMouseActive.value) * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const FluidBackground = ({ darkMode }: FluidBackgroundProps) => {
  const [clickBlobs, setClickBlobs] = useState<ClickBlob[]>([]);
  const startTimeRef = useRef(performance.now() / 1000);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Don't spawn blobs when clicking on UI elements
      const target = event.target as HTMLElement;
      if (target.closest('.controls') || target.closest('.glass-selector') || target.closest('button')) {
        return;
      }
      
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;
      const time = performance.now() / 1000 - startTimeRef.current;
      
      setClickBlobs(prev => [...prev.slice(-7), { x, y, time }]);
    };
    
    // Also handle touch events for mobile
    const handleTouch = (event: TouchEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('.controls') || target.closest('.glass-selector') || target.closest('button')) {
        return;
      }
      
      const touch = event.touches[0];
      if (touch) {
        const x = touch.clientX / window.innerWidth;
        const y = 1 - touch.clientY / window.innerHeight;
        const time = performance.now() / 1000 - startTimeRef.current;
        
        setClickBlobs(prev => [...prev.slice(-7), { x, y, time }]);
      }
    };

    window.addEventListener('click', handleClick);
    if (isMobile) {
      window.addEventListener('touchstart', handleTouch, { passive: true });
    }
    
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [isMobile]);

  return (
    <div className="background-container fluid-background">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        gl={{ 
          antialias: !isMobile, 
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={isMobile ? 1 : [1, 1.5]}
      >
        <FluidMesh darkMode={darkMode} clickBlobs={clickBlobs} />
      </Canvas>
    </div>
  );
};

export default FluidBackground;
