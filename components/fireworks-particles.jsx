

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleSystem({
  count = 200,
  color = "#f59e0b",
  size = 0.03,
  spread = 8,
  speed = 0.3,
}) {
  const meshRef = useRef(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    const initialPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Random starting positions within a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * spread;

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 2;
      positions[i3 + 2] = r * Math.cos(phi);

      initialPositions[i3] = positions[i3];
      initialPositions[i3 + 1] = positions[i3 + 1];
      initialPositions[i3 + 2] = positions[i3 + 2];

      // Random velocities for floating effect
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = Math.random() * 0.02 + 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      lifetimes[i] = Math.random();
    }

    return { positions, velocities, lifetimes, initialPositions };
  }, [count, spread]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const positions = meshRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update lifetime
      particles.lifetimes[i] += 0.002 * speed;
      if (particles.lifetimes[i] > 1) {
        particles.lifetimes[i] = 0;
        // Reset position
        positions[i3] = particles.initialPositions[i3];
        positions[i3 + 1] = particles.initialPositions[i3 + 1];
        positions[i3 + 2] = particles.initialPositions[i3 + 2];
      }

      // Float upward with slight wave motion
      positions[i3] +=
        particles.velocities[i3] + Math.sin(time + i) * 0.001 * speed;
      positions[i3 + 1] += particles.velocities[i3 + 1] * speed;
      positions[i3 + 2] +=
        particles.velocities[i3 + 2] + Math.cos(time + i) * 0.001 * speed;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FireworkBurst({ position }) {
  const meshRef = useRef(null);
  const count = 50;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = position[0];
      positions[i3 + 1] = position[1];
      positions[i3 + 2] = position[2];

      // Burst outward in all directions
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = Math.random() * 0.05 + 0.02;

      velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i3 + 2] = Math.cos(phi) * speed;
    }

    return { positions, velocities };
  }, [position]);

  useFrame(() => {
    if (!meshRef.current) return;

    const positions = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] += particles.velocities[i3];
      positions[i3 + 1] += particles.velocities[i3 + 1] - 0.001; // gravity
      positions[i3 + 2] += particles.velocities[i3 + 2];

      // Fade velocity
      particles.velocities[i3] *= 0.99;
      particles.velocities[i3 + 1] *= 0.99;
      particles.velocities[i3 + 2] *= 0.99;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ef4444"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <ParticleSystem
        count={150}
        color="#f59e0b"
        size={0.04}
        spread={6}
        speed={0.25}
      />
      <ParticleSystem
        count={100}
        color="#ef4444"
        size={0.03}
        spread={8}
        speed={0.2}
      />
      <ParticleSystem
        count={80}
        color="#3b82f6"
        size={0.035}
        spread={7}
        speed={0.3}
      />
      <FireworkBurst position={[-3, 2, -2]} />
      <FireworkBurst position={[3, 1, -3]} />
      <FireworkBurst position={[0, 3, -4]} />
    </>
  );
}

export function FireworksParticles() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
