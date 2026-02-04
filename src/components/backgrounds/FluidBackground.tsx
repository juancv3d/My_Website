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
  uniform vec3 uBlobColorSecondary;
  uniform vec3 uBackgroundColor;
  uniform vec3 uGlowColor;
  uniform float uMouseActive;
  uniform vec2 uGyro; // Gyroscope input for mobile tilt
  
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
  
  // Metaball with controlled falloff for defined edges
  float metaball(vec2 p, vec2 center, float radius) {
    float d = length(p - center);
    // Sharper falloff for more defined blob boundaries
    return pow(radius / (d + 0.001), 2.2);
  }
  
  // FBM for internal texture
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // Dense, viscous lava motion - slow and heavy like real lava
  vec2 lavaMotion(float seed, float time) {
    float t = time * 0.18; // Much slower base speed for viscosity
    float noiseSeed = seed * 100.0;
    
    // Slow, heavy cycle movement (up and down like thick lava)
    float cycle = sin(t * 0.2 + seed * 6.28);
    float y = cycle * 0.35;
    
    // Slower, thicker organic noise to position
    float noiseX = snoise(vec2(t * 0.12 + noiseSeed, seed * 10.0)) * 0.12;
    float noiseY = snoise(vec2(t * 0.08 + noiseSeed + 50.0, seed * 10.0)) * 0.08;
    
    // Reduced horizontal wobble for dense, viscous feel
    float x = sin(t * 0.15 + seed * 3.14) * 0.15 + noiseX;
    y += noiseY;
    
    // Gyroscope influence - slower drift for viscous liquid
    x += uGyro.x * 0.2 * (0.8 + seed * 0.4);
    y += uGyro.y * 0.12 * (0.8 + seed * 0.4);
    
    return vec2(x, y);
  }
  
  // Dynamic blob size (slow breathing for viscous lava)
  float dynamicSize(float baseSize, float seed, float time) {
    float breathe = sin(time * 0.25 + seed * 10.0) * 0.25 + 1.0;
    float pulse = sin(time * 0.6 + seed * 5.0) * 0.08 + 1.0;
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
    
    // Large primary blobs - bigger for better visibility and interaction
    vec2 b1 = lavaMotion(0.0, time) + vec2(-0.15, 0.0);
    mouseDist = length(b1 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.25, 0.0, mouseDist) * 0.6;
    blobs += metaball(p, b1, dynamicSize(0.12, 0.0, time) * heatBoost);
    
    vec2 b2 = lavaMotion(0.2, time) + vec2(0.2, 0.15);
    mouseDist = length(b2 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.25, 0.0, mouseDist) * 0.6;
    blobs += metaball(p, b2, dynamicSize(0.11, 0.2, time) * heatBoost);
    
    vec2 b3 = lavaMotion(0.4, time) + vec2(-0.25, -0.2);
    mouseDist = length(b3 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.25, 0.0, mouseDist) * 0.6;
    blobs += metaball(p, b3, dynamicSize(0.1, 0.4, time) * heatBoost);
    
    // Medium blobs - spaced for interaction
    vec2 b4 = lavaMotion(0.55, time) + vec2(0.3, -0.1);
    mouseDist = length(b4 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.25, 0.0, mouseDist) * 0.5;
    blobs += metaball(p, b4, dynamicSize(0.085, 0.55, time) * heatBoost);
    
    vec2 b5 = lavaMotion(0.7, time) + vec2(-0.35, 0.25);
    mouseDist = length(b5 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.25, 0.0, mouseDist) * 0.5;
    blobs += metaball(p, b5, dynamicSize(0.08, 0.7, time) * heatBoost);
    
    vec2 b6 = lavaMotion(0.85, time) + vec2(0.1, 0.3);
    mouseDist = length(b6 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.25, 0.0, mouseDist) * 0.5;
    blobs += metaball(p, b6, dynamicSize(0.075, 0.85, time) * heatBoost);
    
    // Small accent blobs - fewer and larger for better definition
    vec2 b7 = lavaMotion(0.1, time * 1.15) + vec2(0.38, 0.12);
    mouseDist = length(b7 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.25, 0.0, mouseDist) * 0.4;
    blobs += metaball(p, b7, dynamicSize(0.055, 0.1, time) * heatBoost);
    
    vec2 b8 = lavaMotion(0.3, time * 1.1) + vec2(-0.4, -0.25);
    mouseDist = length(b8 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.25, 0.0, mouseDist) * 0.4;
    blobs += metaball(p, b8, dynamicSize(0.05, 0.3, time) * heatBoost);
    
    vec2 b9 = lavaMotion(0.5, time * 1.2) + vec2(0.12, -0.38);
    mouseDist = length(b9 - mousePos);
    heatBoost = 1.0 + uMouseActive * smoothstep(0.25, 0.0, mouseDist) * 0.4;
    blobs += metaball(p, b9, dynamicSize(0.048, 0.5, time) * heatBoost);
    
    // Click-spawned blobs - dense, viscous movement like thick lava
    for (int i = 0; i < 8; i++) {
      float clickAge = time - uClickTimes[i];
      if (clickAge > 0.0 && clickAge < 16.0) {
        vec2 clickPos = uClickBlobs[i];
        
        // Very slow, heavy rise movement for viscous lava
        float rise = clickAge * 0.018 * (1.0 + snoise(vec2(clickAge * 0.12, float(i))) * 0.12);
        
        // Minimal wobble for dense, thick consistency
        float wobbleX = snoise(vec2(clickAge * 0.15, float(i) * 5.0)) * 0.04;
        float wobbleY = snoise(vec2(clickAge * 0.12 + 50.0, float(i) * 5.0)) * 0.02;
        
        vec2 blobPos = (clickPos - 0.5) * aspect;
        blobPos += vec2(wobbleX, rise + wobbleY);
        
        // Slower grow and longer shrink phases for viscous blobs
        float growPhase = smoothstep(0.0, 3.5, clickAge);
        float shrinkPhase = smoothstep(16.0, 11.0, clickAge);
        float size = 0.06 * growPhase * shrinkPhase;
        // Very slow size pulsation
        size *= 1.0 + sin(clickAge * 0.35) * 0.08;
        
        // Heat boost for click blobs - reduced radius
        mouseDist = length(blobPos - mousePos);
        heatBoost = 1.0 + uMouseActive * smoothstep(0.2, 0.0, mouseDist) * 0.4;
        
        blobs += metaball(p, blobPos, size * heatBoost);
      }
    }
    
    // Higher threshold for more defined, separated blobs (lava lamp style)
    float threshold = 1.4;
    float edge = smoothstep(threshold - 0.15, threshold + 0.05, blobs);
    float glow = smoothstep(threshold - 0.4, threshold - 0.08, blobs);
    float innerGlow = smoothstep(threshold, threshold + 0.3, blobs);
    float highlight = smoothstep(threshold + 0.2, threshold + 0.6, blobs);
    
    // Surface tension effect - creates defined edges
    float surfaceTension = smoothstep(threshold - 0.05, threshold + 0.02, blobs);
    float softEdge = 1.0 - smoothstep(threshold - 0.25, threshold - 0.15, blobs);
    
    // Internal texture - slow, viscous flowing patterns inside blobs
    float internalFlow = 0.0;
    if (edge > 0.1) {
      // Multiple layers of slow flowing noise for thick lava texture
      vec2 flowUV = p * 3.5;
      float flow1 = fbm(flowUV + vec2(time * 0.035, time * 0.022));
      float flow2 = fbm(flowUV * 1.5 - vec2(time * 0.028, -time * 0.018));
      float flow3 = snoise(flowUV * 2.2 + vec2(sin(time * 0.045) * 0.4, cos(time * 0.038) * 0.4));
      
      // Combine flows for dense, viscous look
      internalFlow = (flow1 * 0.5 + flow2 * 0.35 + flow3 * 0.15);
      internalFlow = smoothstep(-0.2, 0.6, internalFlow);
    }
    
    // Color
    vec3 color = uBackgroundColor;
    
    // Mouse proximity for heat effects - reduced radius
    float mouseDistToPixel = length(p - mousePos);
    float nearMouse = smoothstep(0.2, 0.0, mouseDistToPixel) * uMouseActive;
    
    // Heat glow around mouse (visible warm zone) - more subtle
    vec3 heatZoneColor = uGlowColor * 1.5 + vec3(0.1, 0.05, 0.0);
    color = mix(color, heatZoneColor, nearMouse * 0.15);
    
    // Gradient factor based on vertical position (top lighter, bottom darker)
    float gradientFactor = (p.y + 0.6) / 1.2; // Normalize to 0-1 range
    gradientFactor = smoothstep(0.0, 1.0, gradientFactor);
    
    // Create gradient color from secondary to primary (bottom to top)
    vec3 gradientColor = mix(uBlobColorSecondary, uBlobColor, gradientFactor);
    
    // Outer glow with gradient
    vec3 glowGradient = mix(uGlowColor * 0.7, uGlowColor, gradientFactor);
    color = mix(color, glowGradient, glow * 0.4);
    
    // Main blob body with defined edges and gradient
    color = mix(color, gradientColor, edge * surfaceTension);
    
    // Surface definition - creates lava lamp style defined edges
    vec3 edgeColor = gradientColor * 0.85;
    color = mix(color, edgeColor, softEdge * edge * 0.3);
    
    // Internal texture - creates flowing veins inside the blobs with gradient
    vec3 hotVeinColor = gradientColor * 1.5;
    vec3 coolVeinColor = mix(uBlobColorSecondary * 0.8, uBlobColor * 0.6, gradientFactor);
    vec3 textureColor = mix(coolVeinColor, hotVeinColor, internalFlow);
    color = mix(color, textureColor, edge * surfaceTension * 0.5);
    
    // Inner glow for depth with gradient
    vec3 innerGlowColor = mix(uBlobColorSecondary * 1.2, uBlobColor * 1.4, gradientFactor);
    color = mix(color, innerGlowColor, innerGlow * 0.35);
    
    // Hot center with texture influence and gradient
    vec3 hotColor = gradientColor * 1.6;
    float texturedHighlight = highlight * (0.7 + internalFlow * 0.3);
    color = mix(color, hotColor, texturedHighlight * 0.6);
    
    // HEAT EFFECT: Extra brightness on blobs near mouse - more subtle with gradient
    vec3 superHotColor = gradientColor * 2.2;
    float heatGlow = edge * nearMouse;
    color = mix(color, superHotColor, heatGlow * 0.5);
    
    // Add emissive glow when near mouse - reduced
    color += gradientColor * 0.3 * edge * nearMouse;
    
    // Heat from bottom (lava lamp heat source) - use secondary color for bottom glow
    float bottomHeat = smoothstep(-0.5, 0.5, -p.y) * 0.08;
    color += uBlobColorSecondary * bottomHeat * edge * 0.8;
    
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
  gyro: { x: number; y: number };
}

const FluidMesh = ({ darkMode, clickBlobs, gyro }: FluidMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: 0 });
  const gyroRef = useRef({ x: 0, y: 0 });
  const { size, viewport } = useThree();
  
  // Colors based on mode - cool blue gradient colors
  const colors = useMemo(() => {
    if (darkMode) {
      return {
        blob: new THREE.Color('#00aaff'),      // Bright cyan blue
        blobSecondary: new THREE.Color('#0055cc'), // Deep blue for gradient
        background: new THREE.Color('#020206'),
        glow: new THREE.Color('#0077dd'),      // Blue glow
      };
    } else {
      return {
        blob: new THREE.Color('#3399ff'),      // Light blue
        blobSecondary: new THREE.Color('#1166dd'), // Deeper light blue
        background: new THREE.Color('#f5faff'),
        glow: new THREE.Color('#66aaee'),      // Soft blue glow
      };
    }
  }, [darkMode]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uBlobColor: { value: colors.blob },
    uBlobColorSecondary: { value: colors.blobSecondary },
    uBackgroundColor: { value: colors.background },
    uGlowColor: { value: colors.glow },
    uMouseActive: { value: 0 },
    uGyro: { value: new THREE.Vector2(0, 0) },
    uClickBlobs: { value: Array(8).fill(new THREE.Vector2(0, 0)) },
    uClickTimes: { value: Array(8).fill(-100) },
  }), []);

  // Update colors when darkMode changes
  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uBlobColor.value = colors.blob;
      material.uniforms.uBlobColorSecondary.value = colors.blobSecondary;
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
      
      // Slower, viscous mouse tracking
      const currentMouse = material.uniforms.uMouse.value;
      currentMouse.x += (mouseRef.current.x - currentMouse.x) * 0.03;
      currentMouse.y += (mouseRef.current.y - currentMouse.y) * 0.03;
      
      material.uniforms.uMouseActive.value += 
        (mouseRef.current.active - material.uniforms.uMouseActive.value) * 0.02;
      
      // Slower gyroscope tracking for dense liquid
      gyroRef.current.x += (gyro.x - gyroRef.current.x) * 0.04;
      gyroRef.current.y += (gyro.y - gyroRef.current.y) * 0.04;
      material.uniforms.uGyro.value.set(gyroRef.current.x, gyroRef.current.y);
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
  const [gyro, setGyro] = useState({ x: 0, y: 0 });
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [showGyroPrompt, setShowGyroPrompt] = useState(false);
  const startTimeRef = useRef(performance.now() / 1000);
  const isMobile = useIsMobile();

  // Request gyroscope permission for iOS
  const requestGyroPermission = async () => {
    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (permission === 'granted') {
          setGyroEnabled(true);
          setShowGyroPrompt(false);
        }
      } catch {
        setShowGyroPrompt(false);
      }
    } else {
      setGyroEnabled(true);
      setShowGyroPrompt(false);
    }
  };

  // Check if we need to show gyro permission prompt on iOS
  useEffect(() => {
    if (isMobile) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS && typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        setShowGyroPrompt(true);
      } else {
        setGyroEnabled(true);
      }
    }
  }, [isMobile]);

  // Gyroscope handler - slow and viscous response
  useEffect(() => {
    if (!isMobile || !gyroEnabled) return;

    const targetGyro = { x: 0, y: 0 };
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma || 0; // left-right tilt
      const beta = event.beta || 0;   // front-back tilt
      
      // Normalize to -1 to 1 range
      targetGyro.x = Math.max(-1, Math.min(1, gamma / 35));
      targetGyro.y = Math.max(-1, Math.min(1, (beta - 45) / 35));
      
      // Very slow, viscous update for dense lava feel
      setGyro(prev => ({
        x: prev.x + (targetGyro.x - prev.x) * 0.05,
        y: prev.y + (targetGyro.y - prev.y) * 0.05,
      }));
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isMobile, gyroEnabled]);

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

      // Handle gyro prompt click
      if (showGyroPrompt) {
        requestGyroPermission();
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
  }, [isMobile, showGyroPrompt]);

  return (
    <div className="background-container fluid-background">
      {/* iOS Gyroscope Permission Prompt */}
      {showGyroPrompt && (
        <div 
          style={{
            position: 'absolute',
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            zIndex: 100,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
          onClick={requestGyroPermission}
        >
          Tap to enable motion effects
        </div>
      )}
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
        <FluidMesh darkMode={darkMode} clickBlobs={clickBlobs} gyro={gyro} />
      </Canvas>
    </div>
  );
};

export default FluidBackground;
