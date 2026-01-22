"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { Project } from "@/data/projects";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Space_Mono } from "next/font/google";
import { useRouter } from "next/navigation";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// --- Glitch Text Component ---
const GlitchText = ({ children, className, delay = 0 }: { children: string; className?: string; delay?: number }) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0.3, 1, 0.5, 1],
        x: [0, -2, 2, 0, -1, 0],
        textShadow: [
          "0 0 0 rgba(0,0,0,0)",
          "2px 0 #ff0000, -2px 0 #00ffff",
          "-2px 0 #ff0000, 2px 0 #00ffff",
          "1px 0 #ff0000, -1px 0 #00ffff",
          "0 0 0 rgba(0,0,0,0)",
          "0 0 0 rgba(0,0,0,0)",
        ]
      }}
      transition={{
        duration: 0.6,
        delay: delay,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        ease: "easeOut"
      }}
    >
      {children}
    </motion.span>
  );
};

// --- UTILS ---
function generateOrbitalPoints(count: number, baseRadius: number) {
  const points: any[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));

  // Handle edge case: single point
  if (count === 0) return points;
  if (count === 1) {
    points.push({
      basePosition: new THREE.Vector3(baseRadius, 0, 0),
      orbitSpeed: 0.1 + Math.random() * 0.15,
      orbitRadius: 0.3 + Math.random() * 0.4,
      orbitPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.5 + Math.random() * 0.5,
      floatAmount: 0.1 + Math.random() * 0.15,
    });
    return points;
  }

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    points.push({
      basePosition: new THREE.Vector3(x * baseRadius, y * baseRadius, z * baseRadius),
      orbitSpeed: 0.1 + Math.random() * 0.15,
      orbitRadius: 0.3 + Math.random() * 0.4,
      orbitPhase: Math.random() * Math.PI * 2,
      floatSpeed: 0.5 + Math.random() * 0.5,
      floatAmount: 0.1 + Math.random() * 0.15,
    });
  }
  return points;
}

// --- Particle System ---
const ParticleField = ({ count = 100 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 0.5 + 0.1;
    }
    return s;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#FF3B30"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// --- Orbital Ring ---
const OrbitalRing = ({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 64]} />
      <meshBasicMaterial color="#333" transparent opacity={0.5} />
    </mesh>
  );
};

// --- Connection Line with Physics ---
const PhysicsLine = ({
  start,
  end,
  active,
  selected
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  active: boolean;
  selected: boolean;
}) => {
  const lineRef = useRef<THREE.Line>(null);
  const [points, setPoints] = useState<THREE.Vector3[]>(() => {
    // Validate initial points
    if (!start || !end || isNaN(start.x) || isNaN(end.x)) {
      return [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    }
    return [start.clone(), end.clone()];
  });

  useFrame(() => {
    // Validate input vectors
    if (!start || !end || isNaN(start.x) || isNaN(start.y) || isNaN(start.z) ||
      isNaN(end.x) || isNaN(end.y) || isNaN(end.z)) {
      return;
    }

    // Create slight curve based on distance
    const dist = start.distanceTo(end);

    // If points are too close or distance is invalid, just draw a straight line
    if (isNaN(dist) || dist < 0.01) {
      setPoints([start.clone(), end.clone()]);
      return;
    }

    try {
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const direction = end.clone().sub(start).normalize();

      // Calculate perpendicular vector
      let perpendicular = new THREE.Vector3()
        .crossVectors(direction, new THREE.Vector3(0, 1, 0));

      // If parallel to Y-axis, use a different axis
      if (perpendicular.lengthSq() < 0.0001) {
        perpendicular.crossVectors(direction, new THREE.Vector3(1, 0, 0));
      }

      // Validate perpendicular before normalizing
      if (perpendicular.lengthSq() < 0.0001) {
        // Fallback to straight line if we can't find a valid perpendicular
        setPoints([start.clone(), end.clone()]);
        return;
      }

      perpendicular.normalize();

      // Validate normalized perpendicular
      if (isNaN(perpendicular.x) || isNaN(perpendicular.y) || isNaN(perpendicular.z)) {
        setPoints([start.clone(), end.clone()]);
        return;
      }

      const controlPoint = mid.add(perpendicular.multiplyScalar(dist * 0.05));

      // Validate control point
      if (isNaN(controlPoint.x) || isNaN(controlPoint.y) || isNaN(controlPoint.z)) {
        setPoints([start.clone(), end.clone()]);
        return;
      }

      const curve = new THREE.QuadraticBezierCurve3(start, controlPoint, end);
      const curvePoints = curve.getPoints(10);

      // Validate curve points
      const validPoints = curvePoints.every(p =>
        !isNaN(p.x) && !isNaN(p.y) && !isNaN(p.z)
      );

      if (validPoints) {
        setPoints(curvePoints);
      }
    } catch (error) {
      // Fallback to straight line on any error
      setPoints([start.clone(), end.clone()]);
    }
  });

  return (
    <Line
      points={points}
      color={selected ? "#FF3B30" : active ? "#666" : "#333"}
      lineWidth={selected ? 2 : active ? 1.5 : 0.8}
      transparent
      opacity={selected ? 1 : active ? 0.8 : 0.4}
    />
  );
};

// --- Animated Node ---
const AnimatedNode = ({
  basePosition,
  orbitData,
  project,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick,
  corePosition
}: {
  basePosition: THREE.Vector3;
  orbitData: {
    orbitSpeed: number;
    orbitRadius: number;
    orbitPhase: number;
    floatSpeed: number;
    floatAmount: number;
  };
  project: Project;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (p: Project) => void;
  onLeave: () => void;
  onClick: (p: Project) => void;
  corePosition: THREE.Vector3;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const [currentPosition, setCurrentPosition] = useState(() => {
    // Validate basePosition
    if (!basePosition || isNaN(basePosition.x)) {
      console.error("Invalid basePosition for project:", project.codename);
      return new THREE.Vector3(0, 0, 0);
    }
    return basePosition.clone();
  });

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;

      // Orbital motion around base position
      const orbitX = Math.cos(time * orbitData.orbitSpeed + orbitData.orbitPhase) * orbitData.orbitRadius;
      const orbitZ = Math.sin(time * orbitData.orbitSpeed + orbitData.orbitPhase) * orbitData.orbitRadius;

      // Floating motion
      const floatY = Math.sin(time * orbitData.floatSpeed) * orbitData.floatAmount;

      const newPos = new THREE.Vector3(
        basePosition.x + orbitX,
        basePosition.y + floatY,
        basePosition.z + orbitZ
      );

      groupRef.current.position.copy(newPos);
      setCurrentPosition(newPos);

      // Rotate node - subtle
      groupRef.current.rotation.x += 0.008;
      groupRef.current.rotation.y += 0.012;

      // Pulse glow when active
      if (glowRef.current && (isHovered || isSelected)) {
        const pulse = Math.sin(time * 3) * 0.2 + 1;
        glowRef.current.scale.setScalar(pulse);
      }

      // Rotate outer ring slowly
      if (outerRingRef.current) {
        outerRingRef.current.rotation.z = time * 0.8;
      }
    }
  });

  const isActive = isHovered || isSelected;
  const nodeColor = isSelected ? "#FF3B30" : isHovered ? "#888" : "#666";
  const glowColor = isSelected ? "#FF3B30" : "#fff";

  return (
    <>
      {/* Connection line */}
      <PhysicsLine
        start={corePosition}
        end={currentPosition}
        active={isHovered}
        selected={isSelected}
      />

      <group ref={groupRef} position={basePosition}>
        {/* Hit area */}
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); onHover(project); }}
          onPointerOut={onLeave}
          onClick={(e) => { e.stopPropagation(); onClick(project); }}
        >
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Inner core */}
        <mesh>
          <octahedronGeometry args={[isActive ? 0.16 : 0.12, 0]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={isSelected ? 1.8 : isActive ? 1.2 : 0.5}
          />
        </mesh>

        {/* Wireframe shell */}
        <mesh>
          <octahedronGeometry args={[isActive ? 0.26 : 0.2, 0]} />
          <meshBasicMaterial color={nodeColor} wireframe transparent opacity={0.7} />
        </mesh>

        {/* Main ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[isActive ? 0.33 : 0.28, isActive ? 0.36 : 0.3, 32]} />
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={isActive ? 0.7 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer ring for selected only */}
        {isSelected && (
          <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.48, 0.5, 32]} />
            <meshBasicMaterial
              color="#FF3B30"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Glow effect when active */}
        {isActive && (
          <mesh ref={glowRef}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={isSelected ? 0.2 : 0.12}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Single scanning ring for selected node */}
        {isSelected && (
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.7, 0.015, 8, 32]} />
            <meshBasicMaterial
              color="#FF3B30"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Tooltip on hover */}
        {isHovered && !isSelected && (
          <Html position={[0, 0.7, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "text-[10px] font-mono px-2 py-1.5 whitespace-nowrap",
                "bg-black/90 backdrop-blur-sm border border-white/20",
                spaceMono.className
              )}
            >
              <div className="text-white font-medium">{project.codename}</div>
              <div className="text-neutral-500 text-[8px] mt-0.5">{project.id}</div>
            </motion.div>
          </Html>
        )}

        {/* Selected indicator - subtle */}
        {isSelected && (
          <Html position={[0, 0.7, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-[8px] font-mono px-1.5 py-0.5 whitespace-nowrap uppercase tracking-wider",
                "text-[#FF3B30] bg-black/80 backdrop-blur-sm border border-[#FF3B30]/40",
                spaceMono.className
              )}
            >
              SELECTED
            </motion.div>
          </Html>
        )}
      </group>
    </>
  );
};

// --- Camera Controller for tracking selected node ---
const CameraController = ({ targetPosition, enabled }: { targetPosition: THREE.Vector3 | null; enabled: boolean }) => {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current && enabled && targetPosition) {
      // Very subtle tracking - just adjust the look-at target slightly
      const targetLookAt = targetPosition.clone();
      const currentTarget = controlsRef.current.target;

      // Slow, smooth interpolation
      currentTarget.lerp(targetLookAt, 0.02);
      controlsRef.current.update();
    }
  });

  return <OrbitControls
    ref={controlsRef}
    enableZoom={true}
    enablePan={false}
    autoRotate={!enabled}
    autoRotateSpeed={0.15}
    minDistance={5}
    maxDistance={18}
    minPolarAngle={0.2}
    maxPolarAngle={Math.PI - 0.2}
    enableDamping
    dampingFactor={0.05}
  />;
};

// --- Central Core ---
const CoreSystem = ({ onClick, isHovered, setIsHovered }: {
  onClick: () => void;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
    }

    if (innerRef.current) {
      const pulse = Math.sin(time * 2) * 0.1 + 1;
      innerRef.current.scale.setScalar(pulse);
    }

    if (pulseRef.current) {
      const pulse = Math.sin(time * 3) * 0.2 + 1;
      pulseRef.current.scale.setScalar(pulse);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.1 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Hit area */}
      <mesh
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Inner glowing core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.15, 1]} />
        <meshStandardMaterial
          color="#FF3B30"
          emissive="#FF3B30"
          emissiveIntensity={isHovered ? 3 : 2}
        />
      </mesh>

      {/* Pulsing glow */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial
          color="#FF3B30"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wireframe shells */}
      <mesh>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshBasicMaterial color={isHovered ? "#FF3B30" : "#555"} wireframe />
      </mesh>
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshBasicMaterial color={isHovered ? "#FF3B30" : "#444"} wireframe transparent opacity={0.6} />
      </mesh>

      {/* Label on hover */}
      {isHovered && (
        <Html position={[0, 0.7, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="text-[10px] font-mono px-2 py-1 bg-black/90 border border-[#FF3B30]/50 text-[#FF3B30] whitespace-nowrap rounded-sm">
            BROWSE ALL
          </div>
        </Html>
      )}
    </group>
  );
};

// --- Main Scene ---
const Scene = ({
  projects,
  hoveredId,
  selectedId,
  setHoveredProject,
  setSelectedProject,
  onCoreClick
}: {
  projects: Project[];
  hoveredId: string | null;
  selectedId: string | null;
  setHoveredProject: (p: Project | null) => void;
  setSelectedProject: (p: Project | null) => void;
  onCoreClick: () => void;
}) => {
  const orbitalData = useMemo(() => {
    console.log("Scene: Generating orbital data for", projects.length, "projects");
    return generateOrbitalPoints(projects.length, 4);
  }, [projects.length]);
  const corePos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const [coreHovered, setCoreHovered] = useState(false);
  const [selectedNodePosition, setSelectedNodePosition] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    console.log("Scene: projects array:", projects);
    console.log("Scene: orbitalData length:", orbitalData.length);
  }, [projects, orbitalData]);

  // Find the position of the selected node
  useEffect(() => {
    if (selectedId) {
      const selectedIndex = projects.findIndex(p => p.id === selectedId);
      if (selectedIndex !== -1 && orbitalData[selectedIndex]) {
        setSelectedNodePosition(orbitalData[selectedIndex].basePosition);
      }
    } else {
      setSelectedNodePosition(null);
    }
  }, [selectedId, projects, orbitalData]);

  const handleNodeClick = (project: Project) => {
    if (selectedId === project.id) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#fff" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#fff" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#FF3B30" distance={3} decay={2} />

      {/* Particle field */}
      <ParticleField count={150} />

      {/* Orbital rings */}
      <OrbitalRing radius={2.5} speed={0.1} tilt={Math.PI / 6} />
      <OrbitalRing radius={3.5} speed={-0.08} tilt={-Math.PI / 4} />
      <OrbitalRing radius={4.5} speed={0.05} tilt={Math.PI / 3} />

      {/* Core system */}
      <CoreSystem
        onClick={onCoreClick}
        isHovered={coreHovered}
        setIsHovered={setCoreHovered}
      />

      {/* Animated nodes */}
      {projects.map((project, i) => {
        console.log("Rendering node for project:", project.codename, "at index:", i);
        return (
          <AnimatedNode
            key={project.id}
            basePosition={orbitalData[i]?.basePosition}
            orbitData={orbitalData[i]}
            project={project}
            isHovered={hoveredId === project.id}
            isSelected={selectedId === project.id}
            onHover={setHoveredProject}
            onLeave={() => setHoveredProject(null)}
            onClick={handleNodeClick}
            corePosition={corePos}
          />
        );
      })}

      {/* Camera Controls with tracking */}
      <CameraController
        targetPosition={selectedNodePosition}
        enabled={selectedNodePosition !== null}
      />

    </>
  );
};

// --- MAIN COMPONENT ---

export const MissionIndex3D = ({ projects, onClose, onProjectSelect }: { projects: Project[]; onClose: () => void; onProjectSelect: (p: Project) => void }) => {
  const router = useRouter();
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [glitchFlash, setGlitchFlash] = useState(false);
  const [scanLinePos, setScanLinePos] = useState(0);

  // Debug: Log projects on mount
  useEffect(() => {
    console.log("MissionIndex3D received projects:", projects);
    console.log("Projects count:", projects.length);
  }, [projects]);

  useEffect(() => {
    if (!showCanvas) return;
    const interval = setInterval(() => {
      setScanLinePos(prev => (prev + 0.5) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, [showCanvas]);

  useEffect(() => {
    const lines = [
      "[0x00] INIT tactical_display.sys",
      "[0x01] LOAD mission_database",
      "[0x02] CALC orbital_mechanics",
      "[0x03] RENDER particle_system",
      "[0x04] SYNC node_physics",
      "[READY] TACTICAL_VIEW_ONLINE"
    ];

    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex >= lines.length) {
        clearInterval(interval);
        setGlitchFlash(true);
        setTimeout(() => setGlitchFlash(false), 50);
        setTimeout(() => {
          setGlitchFlash(true);
          setTimeout(() => setGlitchFlash(false), 30);
        }, 80);
        setTimeout(() => {
          setShowCanvas(true);
        }, 150);
        return;
      }
      setBootLines(prev => [...prev, lines[lineIndex]]);
      lineIndex++;
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  return (
    <div className={cn("absolute inset-0 bg-[#050505]", spaceMono.className)}>
      {/* Vignette overlay */}
      {showCanvas && (
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.6) 100%)'
          }}
        />
      )}

      {/* Subtle scan lines */}
      {showCanvas && (
        <div
          className="absolute inset-0 z-40 pointer-events-none opacity-20"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.2) 2px,
              rgba(0,0,0,0.2) 4px
            )`
          }}
        />
      )}

      {/* Moving scan line */}
      {showCanvas && (
        <div
          className="absolute left-0 right-0 h-[1px] z-40 pointer-events-none"
          style={{
            top: `${scanLinePos}%`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,59,48,0.4) 50%, transparent 100%)'
          }}
        />
      )}

      {/* Glitch Flash */}
      {glitchFlash && (
        <div className="absolute inset-0 bg-[#FF3B30] z-50 opacity-5" />
      )}

      {/* Boot Terminal */}
      {!showCanvas && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050505]">
          <div className="text-neutral-500 text-[10px] space-y-0.5 text-left font-mono">
            {bootLines.map((line, i) => (
              <div key={i} className={i === bootLines.length - 1 && line?.includes("READY") ? "text-[#FF3B30]" : ""}>
                {line}
              </div>
            ))}
            <span className="inline-block w-1.5 h-3 bg-neutral-500 animate-pulse" />
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      {showCanvas && (
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 2, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
            <Scene
              projects={projects}
              hoveredId={hoveredProject?.id || null}
              selectedId={selectedProject?.id || null}
              setHoveredProject={setHoveredProject}
              setSelectedProject={setSelectedProject}
              onCoreClick={() => setShowSidebar(true)}
            />
          </Canvas>
        </div>
      )}

      {/* Top Bar */}
      {showCanvas && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-black/70 backdrop-blur-md border-b border-white/5 px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse" />
              <span className="text-[10px] text-neutral-400">TACTICAL_VIEW</span>
            </div>
            <div className="text-[10px] text-neutral-600">
              NODES:<span className="text-neutral-400 ml-1">{projects.length}</span>
            </div>
            <div className="text-[10px] text-neutral-600">
              STATUS:<span className="text-[#FF3B30] ml-1">ACTIVE</span>
            </div>
          </div>
          <div className="text-[10px] text-neutral-600 tabular-nums">
            {timestamp}
          </div>
        </div>
      )}

      {/* Selected Project Card */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute top-16 left-4 w-[360px] z-20"
          >
            <div
              className="relative bg-black border-2 border-[#FF3B30]/40 overflow-hidden shadow-[0_0_40px_-5px_rgba(255,59,48,0.4)]"
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))"
              }}
            >
              {/* Corner cuts decorative elements */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FF3B30]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FF3B30]" />

              {/* Scan line effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                initial={{ top: "-100%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(255,59,48,0.1) 50%, transparent 100%)",
                  height: "30%"
                }}
              />

              {/* Header */}
              <div className="relative border-b-2 border-[#FF3B30]/30 px-4 py-2.5 bg-gradient-to-r from-[#FF3B30]/10 to-transparent">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.5, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-1.5 h-1.5 bg-[#FF3B30] animate-pulse" />
                      <div className="absolute inset-0 w-1.5 h-1.5 bg-[#FF3B30] animate-ping" />
                    </motion.div>
                    <GlitchText className="text-[8px] text-[#FF3B30] font-bold tracking-[0.2em]" delay={0}>
                      CLASSIFIED
                    </GlitchText>
                    <div className="h-3 w-px bg-[#FF3B30]/50" />
                    <GlitchText className="text-[8px] text-neutral-500 tracking-wider" delay={0.03}>
                      CLEARANCE: OMEGA
                    </GlitchText>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-neutral-600 hover:text-[#FF3B30] text-[10px] w-5 h-5 flex items-center justify-center border border-neutral-700 hover:border-[#FF3B30] transition-colors"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-baseline gap-2">
                  <GlitchText className="text-[13px] text-white font-bold tracking-wider relative">
                    {selectedProject.codename}
                  </GlitchText>
                  <GlitchText className="text-[8px] text-neutral-600 tracking-widest" delay={0.05}>
                    {`ID:${selectedProject.id}`}
                  </GlitchText>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Mission Title */}
                <div className="border-l-2 border-[#FF3B30]/50 pl-3 py-1 bg-[#FF3B30]/5">
                  <GlitchText className="text-[7px] text-[#FF3B30] uppercase tracking-[0.15em] mb-0.5 font-bold block" delay={0.1}>
                    MISSION DESIGNATION
                  </GlitchText>
                  <GlitchText className="text-[11px] text-neutral-200 leading-tight font-medium block" delay={0.15}>
                    {selectedProject.title}
                  </GlitchText>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="border border-neutral-800 bg-black/40 p-2">
                    <GlitchText className="text-[7px] text-neutral-600 uppercase tracking-[0.15em] mb-1 font-bold block" delay={0.2}>
                      OPERATIONAL STATUS
                    </GlitchText>
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        className={cn(
                          "w-1.5 h-1.5",
                          selectedProject.status === "DEPLOYED" ? "bg-[#00ff00]" :
                            selectedProject.status === "IN_PROGRESS" ? "bg-[#ffaa00]" : "bg-neutral-600"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.5, 1] }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                      />
                      <GlitchText
                        className={cn(
                          "text-[10px] font-bold tracking-wider",
                          selectedProject.status === "DEPLOYED" ? "text-[#00ff00]" :
                            selectedProject.status === "IN_PROGRESS" ? "text-[#ffaa00]" : "text-neutral-500"
                        )}
                        delay={0.25}
                      >
                        {selectedProject.status}
                      </GlitchText>
                    </div>
                  </div>

                  <div className="border border-neutral-800 bg-black/40 p-2">
                    <GlitchText className="text-[7px] text-neutral-600 uppercase tracking-[0.15em] mb-1 font-bold block" delay={0.22}>
                      CLASSIFICATION
                    </GlitchText>
                    <GlitchText className="text-[10px] text-amber-400 font-bold tracking-wider block" delay={0.27}>
                      {selectedProject.classification}
                    </GlitchText>
                  </div>
                </div>

                {/* Metrics */}
                {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                  <div className="border-t border-neutral-800 pt-3">
                    <GlitchText className="text-[7px] text-neutral-600 uppercase tracking-[0.15em] mb-2 font-bold block" delay={0.3}>
                      PERFORMANCE METRICS
                    </GlitchText>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProject.metrics.slice(0, 3).map((metric, idx) => (
                        <div key={idx} className="bg-neutral-900/50 border border-neutral-800 p-1.5">
                          <GlitchText className="text-[7px] text-neutral-600 uppercase mb-0.5 block" delay={0.35 + idx * 0.05}>
                            {metric.label}
                          </GlitchText>
                          <GlitchText className="text-[11px] text-[#00ff00] font-bold tabular-nums block" delay={0.4 + idx * 0.05}>
                            {metric.value}
                          </GlitchText>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="border-t border-neutral-800 pt-3">
                  <GlitchText className="text-[7px] text-neutral-600 uppercase tracking-[0.15em] mb-2 font-bold block" delay={0.5}>
                    TECHNOLOGY STACK
                  </GlitchText>
                  <div className="flex flex-wrap gap-1">
                    {selectedProject.stack.map((t, idx) => (
                      <GlitchText key={t} className="text-[8px] px-1.5 py-0.5 border border-neutral-700 text-neutral-400 bg-neutral-900/50 font-mono tracking-wider inline-block" delay={0.55 + idx * 0.02}>
                        {t}
                      </GlitchText>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-1.5 border-t-2 border-[#FF3B30]/20">
                  <motion.button
                    onClick={() => onProjectSelect(selectedProject)}
                    className="w-full relative text-center text-[9px] py-2.5 bg-[#FF3B30] text-black font-bold uppercase tracking-[0.2em] hover:bg-[#ff5544] transition-all group overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.7, 1] }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    whileHover={{
                      boxShadow: "0 0 20px rgba(255,59,48,0.6), inset 0 0 20px rgba(255,255,255,0.2)"
                    }}
                  >
                    <GlitchText className="relative z-10" delay={0.65}>
                      ▸ ACCESS FULL DOSSIER
                    </GlitchText>
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                      style={{ opacity: 0.2 }}
                    />
                  </motion.button>

                  {(selectedProject.link || selectedProject.github) && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {selectedProject.link && (
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center text-[8px] py-2 border border-neutral-700 text-neutral-400 font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 hover:border-neutral-500 hover:text-neutral-200 transition-all"
                        >
                          LIVE DEMO
                        </a>
                      )}
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center text-[8px] py-2 border border-neutral-700 text-neutral-400 font-bold uppercase tracking-[0.15em] hover:bg-neutral-800 hover:border-neutral-500 hover:text-neutral-200 transition-all"
                        >
                          SOURCE CODE
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer stamp */}
              <div className="border-t border-neutral-800 px-4 py-1.5 bg-black/60 flex justify-between items-center">
                <GlitchText className="text-[7px] text-neutral-700 tracking-[0.2em]" delay={0.7}>
                  AUTHORIZED PERSONNEL ONLY
                </GlitchText>
                <GlitchText className="text-[7px] text-neutral-700 font-mono" delay={0.75}>
                  {timestamp.split(' ')[0]}
                </GlitchText>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Selector Sidebar */}
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.15 }}
            className="absolute top-0 right-0 bottom-0 w-[400px] z-30 flex flex-col"
          >
            {/* Main container with clip path */}
            <div
              className="relative h-full bg-black border-l-2 border-[#FF3B30]/40 flex flex-col overflow-hidden"
              style={{
                clipPath: "polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)"
              }}
            >
              {/* Scanline effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,59,48,0.03) 2px, rgba(255,59,48,0.03) 4px)"
                }}
              />

              {/* Top corner cut decoration */}
              <div className="absolute top-0 left-0 w-4 h-4 border-b-2 border-r-2 border-[#FF3B30]" />

              {/* Header */}
              <div className="relative border-b-2 border-[#FF3B30]/30 px-5 py-4 bg-gradient-to-r from-[#FF3B30]/10 to-transparent z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="relative"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="w-1.5 h-1.5 bg-[#FF3B30]" />
                      <div className="absolute inset-0 w-1.5 h-1.5 bg-[#FF3B30] animate-ping" />
                    </motion.div>
                    <GlitchText className="text-[8px] text-[#FF3B30] font-bold tracking-[0.25em]" delay={0}>
                      MISSION DATABASE
                    </GlitchText>
                  </div>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-neutral-600 hover:text-[#FF3B30] text-[11px] w-6 h-6 flex items-center justify-center border border-neutral-800 hover:border-[#FF3B30] transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-baseline gap-3">
                  <GlitchText className="text-[11px] text-neutral-500 uppercase tracking-[0.2em]" delay={0.05}>
                    TOTAL RECORDS:
                  </GlitchText>
                  <GlitchText className="text-[18px] text-white font-bold tabular-nums" delay={0.1}>
                    {String(projects.length).padStart(2, '0')}
                  </GlitchText>
                </div>

                <div className="mt-2 text-[7px] text-neutral-700 uppercase tracking-[0.2em]">
                  CLEARANCE: OMEGA • ACCESS GRANTED
                </div>
              </div>

              {/* Projects list */}
              <div className="flex-1 overflow-y-auto relative z-10">
                {projects.map((project, index) => (
                  <motion.button
                    key={project.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={() => {
                      setSelectedProject(project);
                      setShowSidebar(false);
                    }}
                    className={cn(
                      "w-full text-left px-5 py-3 border-b border-neutral-900 transition-all relative group",
                      selectedProject?.id === project.id
                        ? "bg-[#FF3B30]/10 border-l-[3px] border-l-[#FF3B30]"
                        : "hover:bg-neutral-900/50 border-l-[3px] border-l-transparent hover:border-l-[#FF3B30]/50"
                    )}
                  >
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#FF3B30]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      initial={false}
                    />

                    <div className="relative flex items-start gap-3">
                      {/* Index number */}
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <span className="text-[10px] text-neutral-700 font-mono font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="w-px h-8 bg-gradient-to-b from-neutral-800 to-transparent" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Status badge and indicators */}
                        <div className="flex items-center gap-2 mb-2">
                          <motion.div
                            className={cn(
                              "w-1.5 h-1.5",
                              project.status === "DEPLOYED" ? "bg-[#00ff00]" :
                                project.status === "IN_PROGRESS" ? "bg-[#ffaa00]" :
                                  "bg-neutral-600"
                            )}
                            animate={{
                              opacity: project.status === "DEPLOYED" ? [1, 0.3, 1] : 1
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className={cn(
                            "text-[8px] px-1.5 py-0.5 border font-mono uppercase tracking-wider",
                            project.status === "DEPLOYED" ? "border-[#00ff00]/30 text-[#00ff00] bg-[#00ff00]/5" :
                              project.status === "IN_PROGRESS" ? "border-[#ffaa00]/30 text-[#ffaa00] bg-[#ffaa00]/5" :
                                "border-neutral-700 text-neutral-500 bg-neutral-900/30"
                          )}>
                            {project.status}
                          </span>
                        </div>

                        {/* Codename */}
                        <div className="text-[13px] text-white font-bold tracking-wide mb-1 group-hover:text-[#FF3B30] transition-colors">
                          {project.codename}
                        </div>

                        {/* Title */}
                        <div className="text-[10px] text-neutral-400 leading-tight mb-2 line-clamp-2">
                          {project.title}
                        </div>

                        {/* ID and classification */}
                        <div className="flex items-center gap-2 text-[8px]">
                          <span className="text-neutral-700 font-mono">ID:{project.id}</span>
                          <span className="text-neutral-800">•</span>
                          <span className="text-neutral-600 uppercase tracking-wider">
                            {project.classification || "GENERAL"}
                          </span>
                        </div>
                      </div>

                      {/* Arrow indicator on hover/selected */}
                      {(selectedProject?.id === project.id || undefined) && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-[#FF3B30] text-[10px] pt-2"
                        >
                          ▸
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="relative border-t-2 border-[#FF3B30]/30 px-5 py-3 bg-black/90 z-10">
                <div className="flex items-center justify-between mb-1">
                  <GlitchText className="text-[7px] text-neutral-700 uppercase tracking-[0.2em]" delay={0}>
                    CONTROLS
                  </GlitchText>
                  <GlitchText className="text-[7px] text-neutral-700 font-mono" delay={0.05}>
                    {timestamp.split(' ')[1]}
                  </GlitchText>
                </div>
                <div className="text-[8px] text-neutral-600 uppercase tracking-[0.15em]">
                  SCROLL: BROWSE • CLICK: SELECT • ESC: CLOSE
                </div>
              </div>

              {/* Bottom corner cut decoration */}
              <div className="absolute bottom-0 right-0 w-4 h-4 border-t-2 border-l-2 border-[#FF3B30]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Bar */}
      {showCanvas && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/70 backdrop-blur-md border-t border-white/5 px-4 py-2.5 flex justify-between items-center">
          <div className="text-[10px] text-neutral-600">
            DRAG:ROTATE • SCROLL:ZOOM • HOVER:PREVIEW • CLICK:SELECT
          </div>
          <button
            onClick={onClose}
            className="text-[10px] text-neutral-500 hover:text-white transition-colors px-3 py-1.5 bg-white/5 hover:bg-[#FF3B30] border border-white/10 hover:border-[#FF3B30] rounded-sm"
          >
            [ESC] CLOSE
          </button>
        </div>
      )}

      {/* Corner data */}
      {showCanvas && (
        <>
          <div className="absolute top-14 right-4 text-[9px] text-neutral-700 z-10 text-right space-y-0.5">
            <div>ORBIT:ACTIVE</div>
            <div>PHYSICS:ON</div>
          </div>
          <div className="absolute bottom-12 right-4 text-[9px] text-neutral-700 z-10 text-right space-y-0.5">
            <div>CAM:10.0m</div>
            <div>FOV:45°</div>
          </div>
        </>
      )}
    </div>
  );
};
