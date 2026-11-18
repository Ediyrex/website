"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

interface InfinityRingsProps {
  reduceMotion: boolean;
}

function FlywheelGyroscope({ reduceMotion }: InfinityRingsProps) {
  const masterGroupRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const beadsRef = useRef<(THREE.Mesh | null)[]>([]);

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
        thickness: 1.4,
        specularIntensity: 1.25,
        specularColor: new THREE.Color("#ffffff"),
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        attenuationColor: new THREE.Color("#ff7b1c"),
        attenuationDistance: 2.6,
        envMapIntensity: 2.2,
      }),
    []
  );

  const innerGlassMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#ffffff"),
        transmission: 0.92,
        opacity: 0.95,
        transparent: true,
        roughness: 0.12,
        metalness: 0.05,
        ior: 1.48,
        thickness: 1.1,
        specularIntensity: 1.1,
        clearcoat: 0.8,
        attenuationColor: new THREE.Color("#ffa65e"),
        attenuationDistance: 3.0,
      }),
    []
  );

  const luminousOrangeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ff7a1f"),
        emissive: new THREE.Color("#ff5900"),
        emissiveIntensity: 2.4,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.92,
      }),
    []
  );

  const beadMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ff9436"),
        transparent: true,
        opacity: 0.95,
      }),
    []
  );

  // Concentric architectural flywheel ring geometries
  const outerTorusGeo = useMemo(
    () => new THREE.TorusGeometry(2.35, 0.13, 44, 160),
    []
  );
  const outerFilamentGeo = useMemo(
    () => new THREE.TorusGeometry(2.35, 0.022, 16, 140),
    []
  );
  const innerTorusGeo = useMemo(
    () => new THREE.TorusGeometry(1.82, 0.065, 32, 120),
    []
  );
  const innerFilamentGeo = useMemo(
    () => new THREE.TorusGeometry(1.82, 0.016, 16, 100),
    []
  );
  const beadGeo = useMemo(() => new THREE.SphereGeometry(0.068, 16, 16), []);

  useEffect(() => {
    return () => {
      glassMaterial.dispose();
      innerGlassMaterial.dispose();
      luminousOrangeMaterial.dispose();
      beadMaterial.dispose();
      outerTorusGeo.dispose();
      outerFilamentGeo.dispose();
      innerTorusGeo.dispose();
      innerFilamentGeo.dispose();
      beadGeo.dispose();
    };
  }, [
    glassMaterial,
    innerGlassMaterial,
    luminousOrangeMaterial,
    beadMaterial,
    outerTorusGeo,
    outerFilamentGeo,
    innerTorusGeo,
    innerFilamentGeo,
    beadGeo,
  ]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (masterGroupRef.current) {
      const targetRotX = reduceMotion ? 0.35 : 0.35 + state.pointer.y * 0.08;
      const targetRotY = reduceMotion ? 0 : state.pointer.x * 0.1;
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.x,
        targetRotX,
        0.05
      );
      masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.y,
        targetRotY,
        0.05
      );
      if (!reduceMotion) {
        masterGroupRef.current.position.y = Math.sin(t * 0.8) * 0.035;
      }
    }

    if (!reduceMotion) {
      if (outerRingRef.current) {
        outerRingRef.current.rotation.z = t * 0.18;
      }
      if (innerRingRef.current) {
        innerRingRef.current.rotation.z = -t * 0.22;
      }

      // Smoothly animate traveling energy beads along the elliptical orbit tracks
      // Outer ring beads (clockwise)
      const outerR = 2.35;
      const bead0Angle = t * 0.42;
      const bead1Angle = t * 0.42 + Math.PI;

      if (beadsRef.current[0]) {
        beadsRef.current[0].position.set(
          Math.cos(bead0Angle) * outerR,
          Math.sin(bead0Angle) * outerR,
          Math.sin(bead0Angle * 2) * 0.04
        );
      }
      if (beadsRef.current[1]) {
        beadsRef.current[1].position.set(
          Math.cos(bead1Angle) * outerR,
          Math.sin(bead1Angle) * outerR,
          Math.sin(bead1Angle * 2) * 0.04
        );
      }

      // Inner ring beads (counter-clockwise)
      const innerR = 1.82;
      const bead2Angle = -t * 0.5 + Math.PI * 0.5;
      const bead3Angle = -t * 0.5 + Math.PI * 1.5;

      if (beadsRef.current[2]) {
        beadsRef.current[2].position.set(
          Math.cos(bead2Angle) * innerR,
          Math.sin(bead2Angle) * innerR,
          Math.cos(bead2Angle * 2) * 0.03
        );
      }
      if (beadsRef.current[3]) {
        beadsRef.current[3].position.set(
          Math.cos(bead3Angle) * innerR,
          Math.sin(bead3Angle) * innerR,
          Math.cos(bead3Angle * 2) * 0.03
        );
      }
    }
  });

  return (
    <group ref={masterGroupRef} position={[0, 0, 0]} rotation={[0.35, 0, 0]}>
      {/* Primary Outer Precision Flywheel Ring (Glass + Core Luminous Filament) */}
      <group scale={[1.18, 0.74, 1.0]}>
        <group ref={outerRingRef}>
          {/* Main Refractive Glass Flywheel Ring */}
          <mesh geometry={outerTorusGeo} material={glassMaterial} />

          {/* Embedded Luminous Amber Accelerator Filament */}
          <mesh geometry={outerFilamentGeo} material={luminousOrangeMaterial} />
        </group>

        {/* Outer Orbiting Data Pulse Beads */}
        <mesh
          ref={(el) => {
            beadsRef.current[0] = el;
          }}
          geometry={beadGeo}
          material={beadMaterial}
        />
        <mesh
          ref={(el) => {
            beadsRef.current[1] = el;
          }}
          geometry={beadGeo}
          material={beadMaterial}
        />
      </group>

      {/* Inner Concentric Kinetic Gyro Ring (Counter-rotates) */}
      <group scale={[1.14, 0.72, 1.0]} rotation={[-0.12, 0.08, 0]}>
        <group ref={innerRingRef}>
          {/* Secondary Refractive Glass Ring */}
          <mesh geometry={innerTorusGeo} material={innerGlassMaterial} />

          {/* Core Fine Filament */}
          <mesh geometry={innerFilamentGeo} material={luminousOrangeMaterial} />
        </group>

        {/* Inner Orbiting Feedback Pulse Beads */}
        <mesh
          ref={(el) => {
            beadsRef.current[2] = el;
          }}
          geometry={beadGeo}
          material={beadMaterial}
        />
        <mesh
          ref={(el) => {
            beadsRef.current[3] = el;
          }}
          geometry={beadGeo}
          material={beadMaterial}
        />
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

        <FlywheelGyroscope reduceMotion={reduceMotion} />

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
