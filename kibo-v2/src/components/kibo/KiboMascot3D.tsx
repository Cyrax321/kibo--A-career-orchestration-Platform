import * as React from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";

interface KiboModelProps {
  mousePosition: { x: number; y: number };
}

// Configure Draco loader for compressed GLB
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
dracoLoader.setDecoderConfig({ type: "js" });

// GLB Model Loader Component
const KiboGLBModel: React.FC<KiboModelProps> = ({ mousePosition }) => {
  const groupRef = React.useRef<THREE.Group>(null);

  const gltf = useLoader(GLTFLoader, "/kibo-new.glb", (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });

  // Clone and optimize the scene with high quality textures
  const clonedScene = React.useMemo(() => {
    const clone = gltf.scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true;
        // Enable high quality texture filtering
        if (child.material && child.material.map) {
          child.material.map.anisotropy = 16; // Sharper textures
          child.material.map.minFilter = THREE.LinearMipmapLinearFilter;
          child.material.map.magFilter = THREE.LinearFilter;
        }
      }
    });
    return clone;
  }, [gltf.scene]);

  // Initial look direction - slightly left facing
  const initialLookX = -0.25;
  const initialLookY = 0;

  // No manual invalidation needed with frameloop="always"

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      const hasMouseMoved = mousePosition.x !== 0 || mousePosition.y !== 0;
      const blendedX = hasMouseMoved ? mousePosition.x : initialLookX;
      const blendedY = hasMouseMoved ? mousePosition.y : initialLookY;

      const targetRotationY = blendedX * 0.3;
      const targetRotationX = blendedY * 0.15;

      const dampFactor = 0.1; // Smoother damping

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        dampFactor
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        dampFactor
      );

      // Breathing animation
      const breathe = 1 + Math.sin(time * 2) * 0.015;
      groupRef.current.scale.set(1, breathe, 1);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={2.2}>
      <primitive object={clonedScene} />
    </group>
  );
};

// Simplified scene - minimal lighting for performance
const KiboScene: React.FC<KiboModelProps> = ({ mousePosition }) => {
  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 5, 5]} intensity={1.2} />
      <directionalLight position={[-2, 3, 4]} intensity={0.4} color="#c4b5fd" />

      <Float
        speed={1.2}
        rotationIntensity={0.05}
        floatIntensity={0.15}
        floatingRange={[-0.02, 0.02]}
      >
        <KiboGLBModel mousePosition={mousePosition} />
      </Float>

      {/* Simple soft shadow blob */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 0.1]}>
        <circleGeometry args={[0.85, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      <Environment preset="city" />
    </>
  );
};

// Main component - optimized for performance
const KiboMascot3D: React.FC<{ className?: string }> = ({ className }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Track visibility dynamically for performance
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "100px" } // Pre-load slightly before view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Throttled mouse tracking
  React.useEffect(() => {
    let rafId: number;
    let lastUpdate = 0;
    const throttleMs = 16; // 60fps tracking for butter smooth feel

    const handleMouseMove = (event: MouseEvent) => {
      // Only track if visible to save CPU
      if (!isVisible) return;

      const now = Date.now();
      if (now - lastUpdate < throttleMs) return;
      lastUpdate = now;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Smoother interpolation target
          const x = (event.clientX - centerX) / (rect.width / 2);
          const y = (event.clientY - centerY) / (rect.height / 2);

          setMousePosition({
            x: Math.max(-1, Math.min(1, x)),
            y: Math.max(-1, Math.min(1, y)),
          });
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible]); // Re-attach when visibility changes

  return (
    <div ref={containerRef} className={className} style={{ minHeight: '400px' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]} // Cap at 1.5 for performance balance
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        // "never" loop completely pauses the internal loop, saving CPU/GPU
        // "always" renders at screen refresh rate
        frameloop={isVisible ? "always" : "never"}
      >
        <React.Suspense fallback={null}>
          <KiboScene mousePosition={mousePosition} />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export { KiboMascot3D };
