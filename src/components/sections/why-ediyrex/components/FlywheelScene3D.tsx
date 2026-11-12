"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

interface InfinityRingsProps {
  reduceMotion: boolean;
}

function GlassInfinityRings({ reduceMotion }: InfinityRingsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftOrbRef = useRef<THREE.Mesh>(null);
  const rightOrbRef = useRef<THREE.Mesh>(null);

  const glassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#fffaf5"),
        transmission: 0.94,
        opacity: 1,
        transparent: true,
        roughness: 0.08,
        metalness: 0.02,
        ior: 1.5,
        thickness: 1.65,
        specularIntensity: 1.25,
        specularColor: new THREE.Color("#ffffff"),
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        attenuationColor: new THREE.Color("#ff7b1c"),
        attenuationDistance: 2.3,
        envMapIntensity: 2.35,
      }),
    []
  );

  const orangeRimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ff7a1f"),
        emissive: new THREE.Color("#ff5900"),
        emissiveIntensity: 2.1,
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88,
      }),
    []
  );

  const ribbonGeo = useMemo(
    () => new THREE.TorusGeometry(1.48, 0.32, 48, 140),
    []
  );
  const filamentGeo = useMemo(
    () => new THREE.TorusGeometry(1.56, 0.028, 16, 120),
    []
  );

  useEffect(() => {
    return () => {
      glassMaterial.dispose();
      orangeRimMaterial.dispose();
      ribbonGeo.dispose();
      filamentGeo.dispose();
    };
  }, [glassMaterial, orangeRimMaterial, ribbonGeo, filamentGeo]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      const targetRotX = reduceMotion ? 0 : state.pointer.y * 0.07;
      const targetRotY = reduceMotion ? 0 : state.pointer.x * 0.09;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.05
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.05
      );
      if (!reduceMotion) {
        groupRef.current.position.y = Math.sin(t * 0.8) * 0.045;
      }
    }

    if (!reduceMotion) {
      if (leftOrbRef.current) {
        const a = t * 0.65;
        leftOrbRef.current.position.set(
          Math.cos(a) * 1.48,
          Math.sin(a) * 1.12,
          0
        );
      }
      if (rightOrbRef.current) {
        const b = -t * 0.65 + Math.PI;
        rightOrbRef.current.position.set(
          Math.cos(b) * 1.48,
          Math.sin(b) * 1.12,
          0
        );
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      {/* Left 3D Volumetric Glass Ribbon Loop */}
      <group position={[-1.42, 0.02, -0.05]} rotation={[0.42, 0.28, 0.14]}>
        <mesh
          geometry={ribbonGeo}
          scale={[1.15, 0.86, 0.42]}
          material={glassMaterial}
        />
        {/* Inner Embedded Luminous Amber Core Filament */}
        <mesh
          geometry={filamentGeo}
          scale={[1.15, 0.86, 0.45]}
          position={[0, 0, -0.02]}
          material={orangeRimMaterial}
        />
        {/* Travelling Warm Highlight Orb */}
        <mesh ref={leftOrbRef} scale={[1.15, 0.86, 1]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color="#ff8c2e" transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Right 3D Volumetric Glass Ribbon Loop */}
      <group position={[1.42, -0.02, 0.05]} rotation={[-0.36, -0.26, -0.14]}>
        <mesh
          geometry={ribbonGeo}
          scale={[1.15, 0.86, 0.42]}
          material={glassMaterial}
        />
        {/* Inner Embedded Luminous Amber Core Filament */}
        <mesh
          geometry={filamentGeo}
          scale={[1.15, 0.86, 0.45]}
          position={[0, 0, 0.02]}
          material={orangeRimMaterial}
        />
        {/* Travelling Warm Highlight Orb */}
        <mesh ref={rightOrbRef} scale={[1.15, 0.86, 1]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color="#ff8c2e" transparent opacity={0.85} />
        </mesh>
      </group>
    </group>
  );
}

export function FlywheelScene3D() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="w-full h-full pointer-events-auto">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, 6.4], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <ambientLight intensity={0.95} color="#fff7ef" />
        <directionalLight position={[4, 6, 5]} intensity={2.1} color="#ffffff" />
        <directionalLight position={[-5, -3, 3]} intensity={1.8} color="#ff852d" />
        <pointLight position={[0, 0, 2.5]} intensity={3.2} color="#ff6500" distance={7} />
        <pointLight position={[-2.4, -1.2, 1.8]} intensity={2.2} color="#ff9642" distance={6} />
        <pointLight position={[2.4, 1.2, 1.8]} intensity={2.0} color="#ff9642" distance={6} />

        {/* Procedural Studio Reflection Lightformers for Real Glass Speculars */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, 0, 0]}>
            <Lightformer
              form="rect"
              intensity={4.5}
              color="#ffffff"
              scale={[8, 2.5, 1]}
              position={[0, 4, 3]}
            />
            <Lightformer
              form="rect"
              intensity={3.8}
              color="#ff8a30"
              scale={[7, 2, 1]}
              position={[-4, -3, 2]}
            />
            <Lightformer
              form="rect"
              intensity={3.5}
              color="#ffb470"
              scale={[6, 2, 1]}
              position={[4, 2, 2]}
            />
            <Lightformer
              form="ring"
              intensity={2.4}
              color="#fff4e6"
              scale={5}
              position={[0, 0, -4]}
            />
          </group>
        </Environment>

        <GlassInfinityRings reduceMotion={reduceMotion} />

        <ContactShadows
          position={[0, -1.72, 0]}
          opacity={0.26}
          scale={9}
          blur={2.4}
          far={3.5}
          color="#5c2b0a"
        />
      </Canvas>
    </div>
  );
}
