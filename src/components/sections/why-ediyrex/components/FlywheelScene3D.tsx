"use client";

import React, { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
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

function StudioLighting() {
  const lightsGroup = useMemo(() => {
    const group = new THREE.Group();

    // 1. Ambient Warm Base Fill
    const ambient = new THREE.AmbientLight("#fff7ef", 0.95);

    // 2. Key Directional Light (Crisp Neutral White)
    const keyDir = new THREE.DirectionalLight("#ffffff", 2.2);
    keyDir.position.set(4, 6, 5);

    // 3. Warm Fill Directional Light (Studio Amber)
    const fillDir = new THREE.DirectionalLight("#ff852d", 1.8);
    fillDir.position.set(-5, -3, 3);

    // 4. Luminous Rim Backlight (Accentuates Glass Edge Speculars)
    const rimDir = new THREE.DirectionalLight("#ffe2c5", 2.4);
    rimDir.position.set(0, 4, -4);

    // 5. Ambient Sky/Ground Warm Contrast
    const hemi = new THREE.HemisphereLight("#fff5ea", "#3d1c06", 1.2);

    // 6. Point Lights for Glass Internal Caustics and Glow
    const point1 = new THREE.PointLight("#ff6500", 3.2, 7);
    point1.position.set(0, 0, 2.5);

    const point2 = new THREE.PointLight("#ff9642", 2.2, 6);
    point2.position.set(-2.4, -1.2, 1.8);

    const point3 = new THREE.PointLight("#ff9642", 2.0, 6);
    point3.position.set(2.4, 1.2, 1.8);

    group.add(ambient, keyDir, fillDir, rimDir, hemi, point1, point2, point3);
    return group;
  }, []);

  return <primitive object={lightsGroup} />;
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
        <Suspense fallback={null}>
          <StudioLighting />

          <FlywheelGyroscope reduceMotion={reduceMotion} />

          <ContactShadows
            position={[0, -1.72, 0]}
            opacity={0.26}
            scale={9}
            blur={2.4}
            far={3.5}
            color="#5c2b0a"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
