'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

/**
 * CivilizationGlobe: A 3D WebGL hero background component
 *
 * Visual Hierarchy:
 * - Canvas: Rendering surface with orthographic perspective
 * - Wireframe Sphere: Central rotating element, dark abyss green (#0B1710)
 *   - Rotation: Slow Y-axis spin (0.0001 rad/frame)
 * - Particle Field: 400 atmospheric particles surrounding the sphere
 *   - Colors: Teal-bright (#79B59F) with varying opacity
 *   - Subtle drift/float animation via perlin-like offset
 * - Orbital Ring: Subtle torus orbiting the sphere
 *   - Color: Teal-bright dark (#39826F)
 *   - Opacity: 0.3 for atmospheric blend
 *   - Rotation: Subtle rotation around X-axis
 */

interface WireframeSphereProps {
  speed?: number;
}

/**
 * WireframeSphere: Rotating wireframe globe
 */
function WireframeSphere({ speed = 0.0001 }: WireframeSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial
        color="#0B1710"
        wireframe={true}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}

interface ParticleFieldProps {
  count?: number;
  speed?: number;
}

/**
 * ParticleField: Atmospheric particles with subtle drift
 */
function ParticleField({ count = 400, speed = 0.0005 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const velocityRef = useRef<Float32Array | null>(null);
  const timeRef = useRef(0);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      // Random positions within a sphere
      const radius = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.cos(phi);
      positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Random velocities for drift
      velocities[i] = (Math.random() - 0.5) * speed;
      velocities[i + 1] = (Math.random() - 0.5) * speed;
      velocities[i + 2] = (Math.random() - 0.5) * speed;
    }

    return { positions, velocities };
  }, [count, speed]);

  positionsRef.current = positions;
  velocityRef.current = velocities;

  useFrame(() => {
    if (pointsRef.current && positionsRef.current && velocityRef.current) {
      const pos = positionsRef.current;
      const vel = velocityRef.current;
      timeRef.current += 0.016;

      for (let i = 0; i < pos.length; i += 3) {
        // Apply velocity
        pos[i] += vel[i];
        pos[i + 1] += vel[i + 1];
        pos[i + 2] += vel[i + 2];

        // Soft bounds with wrapping
        const radius = Math.sqrt(pos[i] ** 2 + pos[i + 1] ** 2 + pos[i + 2] ** 2);
        if (radius > 7) {
          const scale = 4 / radius;
          pos[i] *= scale;
          pos[i + 1] *= scale;
          pos[i + 2] *= scale;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const colors = useMemo(() => {
    const colorArray = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      // #79B59F in RGB: (121, 181, 159)
      colorArray[i] = 121 / 255;
      colorArray[i + 1] = 181 / 255;
      colorArray[i + 2] = 159 / 255;
    }
    return colorArray;
  }, [count]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#79B59F"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.6}
      />
    </points>
  );
}

interface OrbitalRingProps {
  speed?: number;
}

/**
 * OrbitalRing: Subtle torus orbit around the sphere
 */
function OrbitalRing({ speed = 0.0001 }: OrbitalRingProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.5;
      meshRef.current.rotation.z += speed * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.3, 0, 0.2]}>
      <torusGeometry args={[3, 0.1, 16, 32]} />
      <meshStandardMaterial
        color="#39826F"
        transparent={true}
        opacity={0.3}
        emissive="#39826F"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

interface CivilizationGlobeProps {
  onLoad?: () => void;
}

/**
 * CivilizationGlobe: Main component combining all 3D elements
 */
export function CivilizationGlobe({ onLoad }: CivilizationGlobeProps) {
  useEffect(() => {
    // Signal that the 3D component has loaded
    onLoad?.();
  }, [onLoad]);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      <WireframeSphere speed={0.0001} />
      <ParticleField count={400} speed={0.0005} />
      <OrbitalRing speed={0.0001} />
    </Canvas>
  );
}
