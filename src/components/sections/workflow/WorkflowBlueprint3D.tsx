"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Grid } from "@react-three/drei";
import * as THREE from "three";

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

interface EvolvingPavilionProps {
  progressRef: React.MutableRefObject<number>;
}

const ANCHOR_POINTS: readonly [number, number, number][] = [
  [-2.2, 0.05, 1.5],
  [2.2, 0.05, 1.5],
  [2.2, 0.05, -1.5],
  [-2.2, 0.05, -1.5],
  [-1.8, 0.9, 1.15],
  [1.8, 0.9, 1.15],
  [1.8, 0.9, -1.15],
  [-1.8, 0.9, -1.15],
  [-1.1, 1.85, 0.85],
  [1.2, 1.85, 0.85],
  [1.2, 1.85, -0.85],
  [-1.1, 1.85, -0.85],
  [0.1, 2.35, 0.0],
  [-0.8, 0.55, 0.3],
  [0.9, 0.55, -0.3],
  [0.0, 1.2, 0.9],
  [-1.95, 1.45, -0.25],
  [1.95, 1.45, 0.35],
];

const SCATTER_POINTS: readonly [number, number, number][] = ANCHOR_POINTS.map(
  ([x, y, z], idx) => {
    const angle = idx * 1.95;
    return [
      x * 1.45 + Math.cos(angle) * 0.95,
      y * 0.65 + 0.55 + Math.sin(angle * 1.3) * 0.85,
      z * 1.45 + Math.sin(angle) * 0.95,
    ];
  }
);

function EvolvingArchitectureScene({ progressRef }: EvolvingPavilionProps) {
  const dampedRef = useRef(0.18);
  const rigRef = useRef<THREE.Group>(null);
  const pointsGeomRef = useRef<THREE.BufferGeometry>(null);
  const linesGeomRef = useRef<THREE.BufferGeometry>(null);

  const blueprintGroupRef = useRef<THREE.Group>(null);
  const createGroupRef = useRef<THREE.Group>(null);
  const deliverGroupRef = useRef<THREE.Group>(null);
  const bay1Ref = useRef<THREE.Mesh>(null);
  const bay2Ref = useRef<THREE.Mesh>(null);
  const bay3Ref = useRef<THREE.Mesh>(null);
  const roof1Ref = useRef<THREE.Mesh>(null);
  const roof2Ref = useRef<THREE.Mesh>(null);
  const glowLightRef = useRef<THREE.PointLight>(null);
  const gridGroupRef = useRef<THREE.Group>(null);

  // Dynamic point cloud + connecting lines geometries
  const { pointPositions, linePositions } = useMemo(() => {
    const pArr = new Float32Array(ANCHOR_POINTS.length * 3);
    const lPairs: number[] = [];
    for (let i = 0; i < ANCHOR_POINTS.length; i++) {
      const a = SCATTER_POINTS[i];
      pArr[i * 3] = a[0];
      pArr[i * 3 + 1] = a[1];
      pArr[i * 3 + 2] = a[2];
    }
    // Pairwise structural edges
    for (let i = 0; i < ANCHOR_POINTS.length - 1; i++) {
      const next = (i + 1) % ANCHOR_POINTS.length;
      const cross = (i + 4) % ANCHOR_POINTS.length;
      lPairs.push(0, 0, 0, 0, 0, 0);
      lPairs.push(0, 0, 0, 0, 0, 0);
      void next;
      void cross;
    }
    return {
      pointPositions: pArr,
      linePositions: new Float32Array(lPairs.length),
    };
  }, []);

  // Architectural module geometries & wireframes
  const geometries = useMemo(() => {
    const podium = new THREE.BoxGeometry(4.5, 0.24, 3.1);
    const hall = new THREE.BoxGeometry(2.6, 1.0, 2.0);
    const wing = new THREE.BoxGeometry(1.75, 1.35, 1.65);
    const mezzanine = new THREE.BoxGeometry(2.15, 0.85, 1.55);
    const roofLower = new THREE.BoxGeometry(3.2, 0.12, 2.45);
    const roofUpper = new THREE.BoxGeometry(2.55, 0.14, 1.9);

    return {
      podium,
      hall,
      wing,
      mezzanine,
      roofLower,
      roofUpper,
      podiumEdges: new THREE.EdgesGeometry(podium),
      hallEdges: new THREE.EdgesGeometry(hall),
      wingEdges: new THREE.EdgesGeometry(wing),
      mezzEdges: new THREE.EdgesGeometry(mezzanine),
      roofLowerEdges: new THREE.EdgesGeometry(roofLower),
      roofUpperEdges: new THREE.EdgesGeometry(roofUpper),
    };
  }, []);

  const pointMatRef = useRef<THREE.PointsMaterial>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const blueprintOrangeRef = useRef<THREE.LineBasicMaterial>(null);
  const blueprintDarkRef = useRef<THREE.LineBasicMaterial>(null);
  const glassMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const orangeCoreMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const treeMat1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const treeMat2Ref = useRef<THREE.MeshStandardMaterial>(null);
  const stoneMat1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const stoneMat2Ref = useRef<THREE.MeshStandardMaterial>(null);
  const charcoalMat1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const charcoalMat2Ref = useRef<THREE.MeshStandardMaterial>(null);
  const warmMat1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const warmMat2Ref = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
    };
  }, [geometries]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const target = progressRef.current;
    dampedRef.current = THREE.MathUtils.lerp(dampedRef.current, target, 0.1);
    const p = dampedRef.current;

    // Normalized transition weights
    const convergeW = smoothstep(0.24, 0.45, p);
    const defineW = smoothstep(0.32, 0.54, p);
    const createW = smoothstep(0.56, 0.78, p);
    const deliverW = smoothstep(0.78, 0.96, p);

    // Camera calm isometric settle across stages
    const camX = THREE.MathUtils.lerp(6.4, 5.7, deliverW);
    const camY = THREE.MathUtils.lerp(4.7, 3.85, deliverW);
    const camZ = THREE.MathUtils.lerp(6.5, 6.0, deliverW);
    state.camera.position.set(camX, camY, camZ);
    state.camera.lookAt(0, 0.85, 0);

    // Subtle pointer tilt on rig
    if (rigRef.current) {
      const pointerY = state.pointer.x * 0.06;
      const pointerX = -state.pointer.y * 0.04;
      rigRef.current.rotation.y = THREE.MathUtils.lerp(
        rigRef.current.rotation.y,
        pointerY,
        0.05
      );
      rigRef.current.rotation.x = THREE.MathUtils.lerp(
        rigRef.current.rotation.x,
        pointerX,
        0.05
      );
    }

    // 1. Points + Hairlines (Discover -> converge cleanly by Deliver)
    const pAttr = pointsGeomRef.current?.getAttribute(
      "position"
    ) as THREE.BufferAttribute | undefined;
    const lAttr = linesGeomRef.current?.getAttribute(
      "position"
    ) as THREE.BufferAttribute | undefined;

    if (pAttr && lAttr) {
      const driftAmp = (1 - convergeW) * 0.08;
      for (let i = 0; i < ANCHOR_POINTS.length; i++) {
        const s = SCATTER_POINTS[i];
        const a = ANCHOR_POINTS[i];
        const x =
          THREE.MathUtils.lerp(s[0], a[0], convergeW) +
          Math.sin(t * 0.9 + i) * driftAmp;
        const y =
          THREE.MathUtils.lerp(s[1], a[1], convergeW) +
          Math.cos(t * 1.1 + i) * driftAmp;
        const z =
          THREE.MathUtils.lerp(s[2], a[2], convergeW) +
          Math.sin(t * 0.8 + i * 2) * driftAmp;
        pAttr.setXYZ(i, x, y, z);
      }
      pAttr.needsUpdate = true;

      let lIdx = 0;
      const netReveal = smoothstep(0.05, 0.28, p);
      for (let i = 0; i < ANCHOR_POINTS.length - 1; i++) {
        const next = (i + 1) % ANCHOR_POINTS.length;
        const cross = (i + 4) % ANCHOR_POINTS.length;

        const threshold1 = i / ANCHOR_POINTS.length;
        const draw1 = netReveal > threshold1 ? 1 : 0;

        const ax = pAttr.getX(i);
        const ay = pAttr.getY(i);
        const az = pAttr.getZ(i);

        const bx = pAttr.getX(next);
        const by = pAttr.getY(next);
        const bz = pAttr.getZ(next);

        lAttr.setXYZ(lIdx++, ax, ay, az);
        lAttr.setXYZ(
          lIdx++,
          THREE.MathUtils.lerp(ax, bx, draw1),
          THREE.MathUtils.lerp(ay, by, draw1),
          THREE.MathUtils.lerp(az, bz, draw1)
        );

        const cx = pAttr.getX(cross);
        const cy = pAttr.getY(cross);
        const cz = pAttr.getZ(cross);
        lAttr.setXYZ(lIdx++, ax, ay, az);
        lAttr.setXYZ(
          lIdx++,
          THREE.MathUtils.lerp(ax, cx, draw1),
          THREE.MathUtils.lerp(ay, cy, draw1),
          THREE.MathUtils.lerp(az, cz, draw1)
        );
      }
      lAttr.needsUpdate = true;
    }

    if (pointMatRef.current) {
      pointMatRef.current.opacity = Math.max(0, 1 - deliverW * 0.85);
    }
    if (lineMatRef.current) {
      lineMatRef.current.opacity = Math.max(0, (1 - defineW * 0.75) * 0.62);
    }

    // 2. Define Blueprint Wireframes
    const wireframeOpacity = defineW * (1 - deliverW * 0.78);
    if (blueprintOrangeRef.current) {
      blueprintOrangeRef.current.opacity = wireframeOpacity * 0.92;
    }
    if (blueprintDarkRef.current) {
      blueprintDarkRef.current.opacity = wireframeOpacity * 0.55;
    }
    if (blueprintGroupRef.current) {
      blueprintGroupRef.current.scale.y = Math.max(0.04, defineW);
      blueprintGroupRef.current.visible = defineW > 0.01;
    }

    // 3. Create Glass & Glowing Bay Assembly
    if (glassMatRef.current) {
      glassMatRef.current.opacity = createW * (1 - deliverW * 0.25) * 0.62;
    }
    const coreOpacity = createW * (1 - deliverW * 0.15) * 0.88;
    if (orangeCoreMatRef.current) {
      orangeCoreMatRef.current.opacity = coreOpacity;
    }
    if (treeMat1Ref.current) treeMat1Ref.current.opacity = deliverW * 0.9;
    if (treeMat2Ref.current) treeMat2Ref.current.opacity = deliverW * 0.9;

    if (createGroupRef.current) {
      createGroupRef.current.visible = createW > 0.01;
      const lift = (1 - createW) * 0.95;
      if (bay1Ref.current) bay1Ref.current.position.y = 0.62 + lift * 0.5;
      if (bay2Ref.current) bay2Ref.current.position.y = 0.82 + lift * 0.85;
      if (bay3Ref.current) bay3Ref.current.position.y = 1.56 + lift * 1.15;
    }

    // 4. Deliver Refined Architectural Surfaces & Warm Lighting
    const stoneOpacity = deliverW * 0.96;
    const roofOpacity = deliverW * 0.98;
    const winOpacity = deliverW * 0.92;
    const winEmissive = deliverW * 1.55;
    if (stoneMat1Ref.current) stoneMat1Ref.current.opacity = stoneOpacity;
    if (stoneMat2Ref.current) stoneMat2Ref.current.opacity = stoneOpacity;
    if (charcoalMat1Ref.current) charcoalMat1Ref.current.opacity = roofOpacity;
    if (charcoalMat2Ref.current) charcoalMat2Ref.current.opacity = roofOpacity;
    if (warmMat1Ref.current) {
      warmMat1Ref.current.opacity = winOpacity;
      warmMat1Ref.current.emissiveIntensity = winEmissive;
    }
    if (warmMat2Ref.current) {
      warmMat2Ref.current.opacity = winOpacity;
      warmMat2Ref.current.emissiveIntensity = winEmissive;
    }
    if (deliverGroupRef.current) {
      deliverGroupRef.current.visible = deliverW > 0.01;
      deliverGroupRef.current.scale.setScalar(0.95 + deliverW * 0.05);
      if (roof1Ref.current) roof1Ref.current.position.y = 1.16 + (1 - deliverW) * 0.4;
      if (roof2Ref.current) roof2Ref.current.position.y = 2.02 + (1 - deliverW) * 0.55;
    }

    if (glowLightRef.current) {
      glowLightRef.current.intensity = createW * 1.4 + deliverW * 3.8;
    }
    if (gridGroupRef.current) {
      gridGroupRef.current.position.y = -0.02;
    }
  });

  return (
    <group ref={rigRef} position={[0, -0.55, 0]}>
      {/* Architectural Isometric Grid Base */}
      <group ref={gridGroupRef}>
        <Grid
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#d9cfc3"
          sectionSize={2.0}
          sectionThickness={0.9}
          sectionColor="#c7bbb0"
          fadeDistance={9.5}
          fadeStrength={1.6}
          position={[0, 0, 0]}
        />
      </group>

      {/* Stage 01: Dynamic Points + Connecting Network */}
      <points>
        <bufferGeometry ref={pointsGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[pointPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={pointMatRef}
          color="#ff6900"
          size={0.14}
          transparent
          opacity={0.95}
          sizeAttenuation
        />
      </points>
      <lineSegments>
        <bufferGeometry ref={linesGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMatRef}
          color="#bfb3a5"
          transparent
          opacity={0.5}
        />
      </lineSegments>

      {/* Stage 02: Isometric Technical Blueprint Wireframes */}
      <group ref={blueprintGroupRef}>
        <lineSegments geometry={geometries.podiumEdges} position={[0, 0.12, 0]}>
          <lineBasicMaterial
            ref={blueprintOrangeRef}
            color="#ff6900"
            transparent
            opacity={0}
          />
        </lineSegments>
        <lineSegments geometry={geometries.hallEdges} position={[-0.35, 0.62, 0]}>
          <lineBasicMaterial
            ref={blueprintDarkRef}
            color="#22201e"
            transparent
            opacity={0}
          />
        </lineSegments>
        <lineSegments geometry={geometries.wingEdges} position={[1.1, 0.8, 0.2]}>
          <lineBasicMaterial color="#ff6900" transparent opacity={0.45} />
        </lineSegments>
        <lineSegments geometry={geometries.mezzEdges} position={[-0.1, 1.56, -0.15]}>
          <lineBasicMaterial color="#22201e" transparent opacity={0.35} />
        </lineSegments>
        <lineSegments geometry={geometries.roofUpperEdges} position={[0.05, 2.04, -0.1]}>
          <lineBasicMaterial color="#ff6900" transparent opacity={0.5} />
        </lineSegments>
      </group>

      {/* Stage 03: Modular Translucent Glass & Orange Bays */}
      <group ref={createGroupRef}>
        <mesh ref={bay1Ref} geometry={geometries.hall} position={[-0.35, 0.62, 0]}>
          <meshPhysicalMaterial
            ref={glassMatRef}
            color="#fffcf8"
            transmission={0.72}
            transparent
            opacity={0}
            roughness={0.14}
            ior={1.48}
            thickness={0.6}
          />
        </mesh>
        <mesh ref={bay2Ref} geometry={geometries.wing} position={[1.1, 0.82, 0.2]}>
          <meshStandardMaterial
            ref={orangeCoreMatRef}
            color="#ff7a1c"
            emissive="#ff5a00"
            emissiveIntensity={0.9}
            roughness={0.3}
            transparent
            opacity={0}
          />
        </mesh>
        <mesh ref={bay3Ref} geometry={geometries.mezzanine} position={[-0.1, 1.56, -0.15]}>
          <meshPhysicalMaterial
            color="#fffcf8"
            transmission={0.65}
            transparent
            opacity={0.42}
            roughness={0.16}
            ior={1.48}
            thickness={0.5}
          />
        </mesh>
      </group>

      {/* Stage 04: Completed Architectural Pavilion */}
      <group ref={deliverGroupRef}>
        {/* Limestone Podium Plinth */}
        <mesh geometry={geometries.podium} position={[0, 0.12, 0]}>
          <meshStandardMaterial
            ref={stoneMat1Ref}
            color="#efe8de"
            roughness={0.75}
            metalness={0.05}
            transparent
            opacity={0}
          />
        </mesh>
        {/* Main Hall Solid Walls */}
        <mesh
          geometry={geometries.hall}
          scale={[0.98, 0.96, 0.96]}
          position={[-0.35, 0.62, 0]}
        >
          <meshStandardMaterial
            ref={stoneMat2Ref}
            color="#efe8de"
            roughness={0.75}
            metalness={0.05}
            transparent
            opacity={0}
          />
        </mesh>
        {/* Warm Illuminated Glass Wing */}
        <mesh
          geometry={geometries.wing}
          scale={[0.96, 0.94, 0.94]}
          position={[1.1, 0.8, 0.2]}
        >
          <meshStandardMaterial
            ref={warmMat1Ref}
            color="#ffaa5c"
            emissive="#ff6f0f"
            emissiveIntensity={0}
            roughness={0.25}
            transparent
            opacity={0}
          />
        </mesh>
        {/* Upper Studio Cantilever Volume */}
        <mesh
          geometry={geometries.mezzanine}
          scale={[0.96, 0.92, 0.94]}
          position={[-0.1, 1.56, -0.15]}
        >
          <meshStandardMaterial
            ref={warmMat2Ref}
            color="#ffaa5c"
            emissive="#ff6f0f"
            emissiveIntensity={0}
            roughness={0.25}
            transparent
            opacity={0}
          />
        </mesh>
        {/* Dark Charcoal Cantilever Roofs */}
        <mesh ref={roof1Ref} geometry={geometries.roofLower} position={[0.2, 1.16, 0.08]}>
          <meshStandardMaterial
            ref={charcoalMat1Ref}
            color="#22201e"
            roughness={0.5}
            metalness={0.15}
            transparent
            opacity={0}
          />
        </mesh>
        <mesh
          ref={roof2Ref}
          geometry={geometries.roofUpper}
          position={[0.05, 2.02, -0.1]}
          rotation={[0, 0, -0.06]}
        >
          <meshStandardMaterial
            ref={charcoalMat2Ref}
            color="#22201e"
            roughness={0.5}
            metalness={0.15}
            transparent
            opacity={0}
          />
        </mesh>
        {/* Minimal Amber Courtyard Trees */}
        <mesh position={[-1.85, 0.56, 1.0]}>
          <coneGeometry args={[0.24, 0.56, 12]} />
          <meshStandardMaterial
            ref={treeMat1Ref}
            color="#ff7a1c"
            emissive="#ff5a00"
            emissiveIntensity={0.65}
            transparent
            opacity={0}
          />
        </mesh>
        <mesh position={[1.9, 0.52, -0.95]}>
          <coneGeometry args={[0.2, 0.46, 12]} />
          <meshStandardMaterial
            ref={treeMat2Ref}
            color="#ff7a1c"
            emissive="#ff5a00"
            emissiveIntensity={0.65}
            transparent
            opacity={0}
          />
        </mesh>
      </group>

      {/* Dynamic Warm Interior Lighting */}
      <pointLight
        ref={glowLightRef}
        position={[0.4, 1.15, 0.5]}
        color="#ff7a18"
        distance={7}
      />

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.28}
        scale={7.5}
        blur={2.1}
        far={2.8}
        color="#3b220e"
      />
    </group>
  );
}

export function WorkflowBlueprint3D({ progressRef }: EvolvingPavilionProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [6.4, 4.7, 6.5], fov: 34 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={1.1} color="#fff8f0" />
        <directionalLight position={[5, 8, 4]} intensity={1.65} color="#ffffff" />
        <directionalLight position={[-4, 3, -3]} intensity={0.85} color="#ffaa66" />
        <EvolvingArchitectureScene progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
