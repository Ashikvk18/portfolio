"use client";

import { useRef, useMemo, useCallback, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ══════════════════════════════════════════════════════
// SHARED UTILITIES
// ══════════════════════════════════════════════════════

function useScroll() {
  const scrollRef = useRef(0);
  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollRef;
}

// ══════════════════════════════════════════════════════
// 1. STARFIELD — 400 stars with twinkling + shooting stars
// ══════════════════════════════════════════════════════

function Starfield() {
  const starsRef = useRef<THREE.Points>(null);
  const shooterRef = useRef<THREE.Points>(null);
  const starCount = 400;
  const shooterCount = 5;

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const phases = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 25 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
      sizes[i] = 0.02 + Math.random() * 0.08;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, sizes, phases };
  }, []);

  const shooterData = useMemo(() => {
    const pos = new Float32Array(shooterCount * 3);
    const vel = new Float32Array(shooterCount * 3);
    const life = new Float32Array(shooterCount);
    const trail = new Float32Array(shooterCount * 3 * 6); // 6 trail points each
    for (let i = 0; i < shooterCount; i++) {
      life[i] = -Math.random() * 20; // staggered spawn
    }
    return { pos, vel, life, trail };
  }, []);

  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        varying float vAlpha;
        void main() {
          float twinkle = 0.4 + 0.6 * sin(uTime * (0.5 + aPhase) + aPhase * 6.28);
          vAlpha = twinkle;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * 300.0 / -mvPos.z;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float dist = length(gl_PointCoord - 0.5) * 2.0;
          if (dist > 1.0) discard;
          float alpha = vAlpha * (1.0 - dist * dist);
          // cross spike
          vec2 uv = gl_PointCoord - 0.5;
          float cross = exp(-abs(uv.x) * 12.0) * 0.3 + exp(-abs(uv.y) * 12.0) * 0.3;
          alpha += cross * vAlpha * 0.5;
          gl_FragColor = vec4(1.0, 0.95, 0.85, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    starMaterial.uniforms.uTime.value = t;

    // Shooting stars
    const sd = shooterData;
    if (shooterRef.current) {
      const trailGeo = shooterRef.current.geometry;
      const trailPos = trailGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < shooterCount; i++) {
        sd.life[i] += 0.016;
        if (sd.life[i] > 2.0 || sd.life[i] < 0) {
          if (sd.life[i] > 2.0) {
            // Reset
            sd.pos[i * 3] = (Math.random() - 0.5) * 40;
            sd.pos[i * 3 + 1] = 15 + Math.random() * 12;
            sd.pos[i * 3 + 2] = -5 - Math.random() * 15;
            sd.vel[i * 3] = (Math.random() - 0.3) * 8;
            sd.vel[i * 3 + 1] = -3 - Math.random() * 4;
            sd.vel[i * 3 + 2] = -Math.random() * 2;
            sd.life[i] = 0;
          }
          // Hide trail
          for (let j = 0; j < 6; j++) {
            const idx = (i * 6 + j) * 3;
            trailPos[idx] = 0; trailPos[idx + 1] = -100; trailPos[idx + 2] = 0;
          }
          continue;
        }

        const dt = 0.016;
        sd.pos[i * 3] += sd.vel[i * 3] * dt;
        sd.pos[i * 3 + 1] += sd.vel[i * 3 + 1] * dt;
        sd.pos[i * 3 + 2] += sd.vel[i * 3 + 2] * dt;

        // Trail positions (head to tail)
        for (let j = 5; j > 0; j--) {
          const curr = (i * 6 + j) * 3;
          const prev = (i * 6 + j - 1) * 3;
          trailPos[curr] = trailPos[prev];
          trailPos[curr + 1] = trailPos[prev + 1];
          trailPos[curr + 2] = trailPos[prev + 2];
        }
        const head = (i * 6) * 3;
        trailPos[head] = sd.pos[i * 3];
        trailPos[head + 1] = sd.pos[i * 3 + 1];
        trailPos[head + 2] = sd.pos[i * 3 + 2];
      }
      trailGeo.attributes.position.needsUpdate = true;
    }
  });

  const trailSizes = useMemo(() => {
    const s = new Float32Array(shooterCount * 6);
    for (let i = 0; i < shooterCount; i++) {
      for (let j = 0; j < 6; j++) {
        s[i * 6 + j] = 0.06 * (1 - j / 6);
      }
    }
    return s;
  }, []);

  return (
    <>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={starCount} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" array={sizes} count={starCount} itemSize={1} />
          <bufferAttribute attach="attributes-aPhase" array={phases} count={starCount} itemSize={1} />
        </bufferGeometry>
        <primitive object={starMaterial} attach="material" />
      </points>
      <points ref={shooterRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={shooterData.trail} count={shooterCount * 6} itemSize={3} />
          <bufferAttribute attach="attributes-aSize" array={trailSizes} count={shooterCount * 6} itemSize={1} />
          <bufferAttribute attach="attributes-aPhase" array={new Float32Array(shooterCount * 6)} count={shooterCount * 6} itemSize={1} />
        </bufferGeometry>
        <primitive object={starMaterial} attach="material" />
      </points>
    </>
  );
}

// ══════════════════════════════════════════════════════
// 2. MOON — 3D sphere with volumetric glow
// ══════════════════════════════════════════════════════

function Moon() {
  const moonRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const moonMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vNormal = normal;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      void main() {
        vec3 lightDir = normalize(vec3(-0.3, 0.2, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.0);
        vec3 baseColor = mix(vec3(0.63, 0.56, 0.31), vec3(0.96, 0.94, 0.82), diff);
        // Craters
        float crater1 = 1.0 - smoothstep(0.05, 0.08, length(vUv - vec2(0.6, 0.35)));
        float crater2 = 1.0 - smoothstep(0.03, 0.06, length(vUv - vec2(0.35, 0.6)));
        float crater3 = 1.0 - smoothstep(0.02, 0.04, length(vUv - vec2(0.7, 0.65)));
        float craters = (crater1 + crater2 + crater3) * 0.1;
        baseColor -= craters;
        gl_FragColor = vec4(baseColor, 1.0);
      }
    `,
  }), []);

  const glowMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        gl_FragColor = vec4(0.96, 0.94, 0.78, intensity * 0.4);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  return (
    <group ref={moonRef} position={[12, 10, -20]}>
      <mesh material={moonMat}>
        <sphereGeometry args={[1.8, 32, 32]} />
      </mesh>
      <mesh ref={glowRef} material={glowMat}>
        <sphereGeometry args={[2.5, 32, 32]} />
      </mesh>
      {/* Outer halo sprite */}
      <sprite scale={[12, 12, 1]}>
        <spriteMaterial
          color="#f5f0c8"
          opacity={0.06}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

// ══════════════════════════════════════════════════════
// 3. SPELL DUEL — two wand points with colliding beams
// ══════════════════════════════════════════════════════

function SpellDuel() {
  const particlesRef = useRef<THREE.Points>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const flashRef = useRef<THREE.PointLight>(null);
  const count = 600;

  const { positions, velocities, colors, life } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const life = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      life[i] = -Math.random() * 3;
    }
    return { positions, velocities, colors, life };
  }, []);

  const spellMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute vec3 aColor;
      attribute float aLife;
      varying vec3 vColor;
      varying float vLife;
      void main() {
        vColor = aColor;
        vLife = aLife;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (1.0 - aLife) * 120.0 / -mvPos.z;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vLife;
      void main() {
        float dist = length(gl_PointCoord - 0.5) * 2.0;
        if (dist > 1.0) discard;
        float alpha = (1.0 - dist) * (1.0 - vLife) * 0.8;
        vec3 col = vColor + vec3(0.3) * (1.0 - dist);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  // Wand positions - left (red/Voldemort) and right (gold/Harry)
  const wandLeft = useMemo(() => new THREE.Vector3(-8, 2, -5), []);
  const wandRight = useMemo(() => new THREE.Vector3(8, 2, -5), []);
  const collisionPoint = useMemo(() => new THREE.Vector3(0, 3, -5), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    spellMat.uniforms.uTime.value = t;

    const posArray = positions;
    const colArray = colors;
    const collision = collisionPoint.clone();
    collision.y += Math.sin(t * 2) * 0.3;
    collision.x += Math.sin(t * 1.5) * 0.5;

    for (let i = 0; i < count; i++) {
      life[i] += 0.012;

      if (life[i] > 1.0 || life[i] < 0) {
        if (life[i] < 0) continue;
        // Reset particle
        life[i] = 0;
        const isLeft = i < count / 2;
        const origin = isLeft ? wandLeft : wandRight;
        const target = collision;
        const dir = target.clone().sub(origin).normalize();

        posArray[i * 3] = origin.x + (Math.random() - 0.5) * 0.3;
        posArray[i * 3 + 1] = origin.y + (Math.random() - 0.5) * 0.3;
        posArray[i * 3 + 2] = origin.z + (Math.random() - 0.5) * 0.3;

        const speed = 6 + Math.random() * 4;
        velocities[i * 3] = dir.x * speed + (Math.random() - 0.5) * 1.5;
        velocities[i * 3 + 1] = dir.y * speed + (Math.random() - 0.5) * 1.5;
        velocities[i * 3 + 2] = dir.z * speed + (Math.random() - 0.5) * 0.5;

        if (isLeft) {
          // Avada Kedavra green
          colArray[i * 3] = 0.1 + Math.random() * 0.2;
          colArray[i * 3 + 1] = 0.8 + Math.random() * 0.2;
          colArray[i * 3 + 2] = 0.1;
        } else {
          // Expelliarmus gold/red
          colArray[i * 3] = 0.9 + Math.random() * 0.1;
          colArray[i * 3 + 1] = 0.3 + Math.random() * 0.4;
          colArray[i * 3 + 2] = 0.05;
        }
      }

      // Check for collision zone — explode outward
      const px = posArray[i * 3], py = posArray[i * 3 + 1], pz = posArray[i * 3 + 2];
      const dx = px - collision.x, dy = py - collision.y, dz = pz - collision.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 1.2 && life[i] > 0.3) {
        // Scatter on collision
        velocities[i * 3] = (Math.random() - 0.5) * 8;
        velocities[i * 3 + 1] = Math.random() * 6;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 8;
        life[i] = 0.7; // age quickly
      }

      const dt = 0.016;
      posArray[i * 3] += velocities[i * 3] * dt;
      posArray[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      posArray[i * 3 + 2] += velocities[i * 3 + 2] * dt;
      velocities[i * 3 + 1] -= 0.5 * dt; // gravity
    }

    if (particlesRef.current) {
      const geo = particlesRef.current.geometry;
      geo.attributes.position.needsUpdate = true;
      geo.attributes.aColor.needsUpdate = true;
      geo.attributes.aLife.needsUpdate = true;
    }

    // Flash light at collision
    if (flashRef.current) {
      flashRef.current.position.copy(collision);
      flashRef.current.intensity = 2 + Math.sin(t * 8) * 1.5 + Math.sin(t * 13) * 0.8;
    }

    // Beam connection
    if (beamRef.current) {
      beamRef.current.position.copy(collision);
    }
  });

  return (
    <group position={[0, -2, 0]}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-aColor" array={colors} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-aLife" array={life} count={count} itemSize={1} />
        </bufferGeometry>
        <primitive object={spellMat} attach="material" />
      </points>

      {/* Collision glow */}
      <pointLight ref={flashRef} color="#ffcc44" intensity={3} distance={15} decay={2} />

      {/* Wand glow - left (green) */}
      <pointLight position={[-8, 2, -5]} color="#22ff44" intensity={1.5} distance={6} decay={2} />
      {/* Wand glow - right (gold) */}
      <pointLight position={[8, 2, -5]} color="#ffaa22" intensity={1.5} distance={6} decay={2} />

      {/* Silhouette figures */}
      <DuelFigure position={[-9, -0.5, -4]} flip={false} color="#111108" />
      <DuelFigure position={[9, -0.5, -4]} flip={true} color="#111108" />
    </group>
  );
}

function DuelFigure({ position, flip, color }: { position: [number, number, number]; flip: boolean; color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = flip ? -0.3 : 0.3;
      // Subtle breathing
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position} scale={[flip ? -1 : 1, 1, 1]}>
      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.2, 1.0, 4, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Arm (wand arm extended) */}
      <mesh position={[0.6, 1.1, 0]} rotation={[0, 0, -0.8]}>
        <capsuleGeometry args={[0.06, 0.8, 4, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Cloak */}
      <mesh position={[0, 0.2, 0.1]}>
        <coneGeometry args={[0.5, 1.5, 6]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════════
// 4. BUCKBEAK FLIGHT — silhouette flying across the moon
// ══════════════════════════════════════════════════════

function BuckbeakFlight() {
  const groupRef = useRef<THREE.Group>(null);
  const wingAngle = useRef(0);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!groupRef.current) return;

    // Fly in a slow arc across the scene
    const cycle = (t * 0.08) % 1; // full cycle every ~12.5s
    const x = -20 + cycle * 40;
    const y = 8 + Math.sin(cycle * Math.PI) * 4 + Math.sin(t * 0.8) * 0.3;
    const z = -18 + Math.sin(cycle * Math.PI) * 3;

    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
    groupRef.current.rotation.y = cycle < 0.5 ? 0.2 : -0.2;

    wingAngle.current = Math.sin(t * 3) * 0.6;
  });

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]}>
      {/* Body */}
      <mesh position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
        <capsuleGeometry args={[0.25, 1.8, 4, 8]} />
        <meshBasicMaterial color="#0a0812" />
      </mesh>
      {/* Head/beak */}
      <mesh position={[1.2, 0.2, 0]}>
        <coneGeometry args={[0.18, 0.6, 6]} />
        <meshBasicMaterial color="#0a0812" />
      </mesh>
      {/* Wings - animated */}
      <BuckbeakWing side={1} />
      <BuckbeakWing side={-1} />
      {/* Tail feathers */}
      <mesh position={[-1.2, 0.1, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.15, 1.0, 4]} />
        <meshBasicMaterial color="#0a0812" />
      </mesh>
      {/* Rider silhouette */}
      <group position={[0.2, 0.5, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 4, 6]} />
          <meshBasicMaterial color="#080610" />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.14, 6, 6]} />
          <meshBasicMaterial color="#080610" />
        </mesh>
      </group>
    </group>
  );
}

function BuckbeakWing({ side }: { side: number }) {
  const wingRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (wingRef.current) {
      wingRef.current.rotation.z = side * (0.3 + Math.sin(clock.elapsedTime * 3) * 0.5);
    }
  });

  return (
    <mesh ref={wingRef} position={[0, 0.15, side * 0.3]} rotation={[0.3 * side, 0, 0]}>
      <planeGeometry args={[2.5, 0.6, 4, 1]} />
      <meshBasicMaterial color="#0a0812" side={THREE.DoubleSide} />
    </mesh>
  );
}

// ══════════════════════════════════════════════════════
// 5. TOWER SCENE — Astronomy tower with dramatic lighting
// ══════════════════════════════════════════════════════

function TowerScene() {
  const lightRef = useRef<THREE.PointLight>(null);
  const figureRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Lightning flash effect
    if (lightRef.current) {
      const flash = Math.random() < 0.005 ? 8 : 0;
      lightRef.current.intensity = 0.3 + Math.sin(t * 0.5) * 0.15 + flash;
    }
    // Figure slight sway
    if (figureRef.current) {
      figureRef.current.rotation.z = Math.sin(t * 0.3) * 0.02;
    }
  });

  return (
    <group position={[0, -6, -12]}>
      {/* Tower structure */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[1.5, 2, 10, 8]} />
        <meshStandardMaterial color="#0c0818" roughness={0.95} metalness={0} />
      </mesh>
      {/* Tower top / parapet */}
      <mesh position={[0, 8.2, 0]}>
        <cylinderGeometry args={[2, 1.6, 0.6, 8]} />
        <meshStandardMaterial color="#0e0a1c" roughness={0.9} />
      </mesh>
      {/* Battlements */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.8, 8.8, Math.sin(angle) * 1.8]}>
            <boxGeometry args={[0.4, 0.6, 0.4]} />
            <meshStandardMaterial color="#0e0a1c" />
          </mesh>
        );
      })}
      {/* Figure on tower (Dumbledore/Snape silhouette) */}
      <group ref={figureRef} position={[0.5, 8.8, 0.8]}>
        <mesh position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.15, 0.8, 4, 8]} />
          <meshBasicMaterial color="#050308" />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.16, 6, 6]} />
          <meshBasicMaterial color="#050308" />
        </mesh>
      </group>
      {/* Second figure (Snape) */}
      <group position={[-1, 8.8, -0.5]}>
        <mesh position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.15, 0.8, 4, 8]} />
          <meshBasicMaterial color="#050308" />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.16, 6, 6]} />
          <meshBasicMaterial color="#050308" />
        </mesh>
        {/* Wand arm */}
        <mesh position={[0.4, 0.9, 0]} rotation={[0, 0, -1.2]}>
          <capsuleGeometry args={[0.04, 0.6, 4, 6]} />
          <meshBasicMaterial color="#050308" />
        </mesh>
      </group>
      {/* Green spell flash */}
      <pointLight ref={lightRef} position={[-0.5, 9.5, 0]} color="#22ff44" intensity={0.3} distance={8} decay={2} />
      {/* Dramatic ambient */}
      <pointLight position={[3, 12, 2]} color="#334466" intensity={0.8} distance={20} decay={2} />
    </group>
  );
}

// ══════════════════════════════════════════════════════
// 6. VOLUMETRIC FOG PLANES
// ══════════════════════════════════════════════════════

function VolumetricFog() {
  const fogMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0.04, 0.02, 0.08) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;

      // Simple noise
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        float n = noise(uv * 3.0 + uTime * 0.1) * 0.5 +
                  noise(uv * 6.0 - uTime * 0.15) * 0.3 +
                  noise(uv * 12.0 + uTime * 0.08) * 0.2;
        float edgeFade = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x);
        float topFade = smoothstep(0.0, 0.5, uv.y);
        float alpha = n * edgeFade * topFade * 0.4;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    fogMat.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <>
      {/* Low fog layer */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]} material={fogMat}>
        <planeGeometry args={[60, 30, 1, 1]} />
      </mesh>
      {/* Mid fog layer */}
      <mesh position={[0, 0, -8]} rotation={[0, 0, 0]} material={fogMat}>
        <planeGeometry args={[50, 8, 1, 1]} />
      </mesh>
    </>
  );
}

// ══════════════════════════════════════════════════════
// 7. MAGICAL PARTICLES (ambient floating magic)
// ══════════════════════════════════════════════════════

function MagicParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 150;

  const { positions, velocities, phases, colorData } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const colorData = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = Math.random() * 20 - 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      velocities[i * 3] = (Math.random() - 0.5) * 0.3;
      velocities[i * 3 + 1] = 0.1 + Math.random() * 0.4;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      phases[i] = Math.random() * Math.PI * 2;
      // Gold, purple, or blue particles
      const choice = Math.random();
      if (choice < 0.4) { colorData[i*3]=1; colorData[i*3+1]=0.8; colorData[i*3+2]=0.2; }
      else if (choice < 0.7) { colorData[i*3]=0.6; colorData[i*3+1]=0.4; colorData[i*3+2]=1; }
      else { colorData[i*3]=0.3; colorData[i*3+1]=0.7; colorData[i*3+2]=1; }
    }
    return { positions, velocities, phases, colorData };
  }, []);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float aPhase;
      attribute vec3 aColor;
      uniform float uTime;
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        vColor = aColor;
        float pulse = 0.3 + 0.7 * sin(uTime * 0.8 + aPhase);
        vAlpha = pulse * 0.6;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = pulse * 80.0 / -mvPos.z;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - 0.5) * 2.0;
        if (dist > 1.0) discard;
        float alpha = (1.0 - dist * dist) * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
    const pos = positions;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3] * 0.016;
      pos[i * 3 + 1] += velocities[i * 3 + 1] * 0.016;
      pos[i * 3 + 2] += velocities[i * 3 + 2] * 0.016;
      // Drift with sine
      pos[i * 3] += Math.sin(clock.elapsedTime * 0.3 + phases[i]) * 0.003;

      // Reset if too high
      if (pos[i * 3 + 1] > 18) {
        pos[i * 3 + 1] = -5;
        pos[i * 3] = (Math.random() - 0.5) * 40;
      }
    }
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-aPhase" array={phases} count={count} itemSize={1} />
        <bufferAttribute attach="attributes-aColor" array={colorData} count={count} itemSize={3} />
      </bufferGeometry>
      <primitive object={mat} attach="material" />
    </points>
  );
}

// ══════════════════════════════════════════════════════
// 8. CAMERA CONTROLLER — scroll-driven with scenes
// ══════════════════════════════════════════════════════

function CameraController() {
  const scrollRef = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    const scroll = scrollRef.current;
    const pageH = typeof document !== "undefined"
      ? document.body.scrollHeight - window.innerHeight
      : 5000;
    const ratio = Math.min(scroll / Math.max(pageH, 1), 1);

    // Slow camera drift based on scroll
    camera.position.y = 2 + ratio * 3;
    camera.position.z = 15 - ratio * 5;
    camera.lookAt(0, 2 + ratio * 2, -10);
  });

  return null;
}

// ══════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 2, 15], fov: 60, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
        }}
        dpr={[1, 1.5]}
        style={{ background: "#020108" }}
      >
        {/* Global lighting */}
        <ambientLight intensity={0.03} color="#1a1030" />
        <directionalLight position={[10, 15, -10]} intensity={0.08} color="#c8b8ff" />

        {/* Sky elements */}
        <Starfield />
        <Moon />

        {/* Cinematic scenes */}
        <SpellDuel />
        <BuckbeakFlight />
        <TowerScene />

        {/* Atmosphere */}
        <VolumetricFog />
        <MagicParticles />

        {/* Camera */}
        <CameraController />

        {/* Scene fog */}
        <fog attach="fog" args={["#020108", 20, 60]} />
      </Canvas>
    </div>
  );
}
