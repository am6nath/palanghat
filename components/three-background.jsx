

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function CreamyWaves() {
  const meshRef = useRef(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={15}>
      <sphereGeometry args={[1, 128, 128]} />
      <MeshDistortMaterial
        color="#f9f4eb"
        distort={0.4}
        speed={1.5}
        roughness={0.6}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none w-full h-full bg-[#f4eee0]">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={1.2} color="#ffffff" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          color="#ffffff"
        />
        <directionalLight
          position={[-10, -5, -10]}
          intensity={0.5}
          color="#e0d4c3"
        />

        <CreamyWaves />

        <Sparkles
          count={100}
          scale={25}
          size={2.5}
          speed={0.3}
          opacity={0.4}
          color="#dbbc9c"
        />
      </Canvas>
    </div>
  );
}
