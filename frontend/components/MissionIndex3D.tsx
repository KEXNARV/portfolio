"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { Project } from "@/data/projects";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// --- UTILS ---
function generateOrbitalPoints(count: number, baseRadius: number) {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5));

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
  const [points, setPoints] = useState<THREE.Vector3[]>([start, end]);

  useFrame(() => {
    // Create slight curve based on distance
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    const perpendicular = new THREE.Vector3()
      .crossVectors(
        end.clone().sub(start).normalize(),
        new THREE.Vector3(0, 1, 0)
      )
      .normalize();

    const curve = new THREE.QuadraticBezierCurve3(
      start,
      mid.add(perpendicular.multiplyScalar(dist * 0.05)),
      end
    );
    setPoints(curve.getPoints(10));
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
  const [currentPosition, setCurrentPosition] = useState(basePosition.clone());

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

      // Rotate node
      groupRef.current.rotation.x += 0.01;
      groupRef.current.rotation.y += 0.015;

      // Pulse glow when active
      if (glowRef.current && (isHovered || isSelected)) {
        const pulse = Math.sin(time * 4) * 0.3 + 1;
        glowRef.current.scale.setScalar(pulse);
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
          <octahedronGeometry args={[isActive ? 0.18 : 0.12, 0]} />
          <meshStandardMaterial
            color={nodeColor}
            emissive={nodeColor}
            emissiveIntensity={isActive ? 1.5 : 0.5}
          />
        </mesh>

        {/* Wireframe shell */}
        <mesh>
          <octahedronGeometry args={[isActive ? 0.28 : 0.2, 0]} />
          <meshBasicMaterial color={nodeColor} wireframe transparent opacity={0.8} />
        </mesh>

        {/* Outer ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[isActive ? 0.35 : 0.28, isActive ? 0.38 : 0.3, isActive ? 32 : 6]} />
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={isActive ? 0.8 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Glow effect when active */}
        {isActive && (
          <mesh ref={glowRef}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Tooltip on hover */}
        {isHovered && !isSelected && (
          <Html position={[0, 0.7, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <div className={cn(
              "text-[10px] font-mono px-2 py-1.5 whitespace-nowrap rounded-sm",
              "bg-black/90 backdrop-blur-sm border border-white/20",
              spaceMono.className
            )}>
              <div className="text-white font-medium">{project.codename}</div>
              <div className="text-neutral-500 text-[9px]">{project.id}</div>
            </div>
          </Html>
        )}

        {/* Selected indicator */}
        {isSelected && (
          <Html position={[0, 0.6, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className={cn(
              "text-[9px] font-mono px-1.5 py-0.5 whitespace-nowrap rounded-sm",
              "text-[#FF3B30] bg-black/60 backdrop-blur-sm border border-[#FF3B30]/30",
              spaceMono.className
            )}>
              SELECTED
            </div>
          </Html>
        )}
      </group>
    </>
  );
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
  const orbitalData = useMemo(() => generateOrbitalPoints(projects.length, 4), [projects.length]);
  const corePos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const [coreHovered, setCoreHovered] = useState(false);

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
      {projects.map((project, i) => (
        <AnimatedNode
          key={project.id}
          basePosition={orbitalData[i].basePosition}
          orbitData={orbitalData[i]}
          project={project}
          isHovered={hoveredId === project.id}
          isSelected={selectedId === project.id}
          onHover={setHoveredProject}
          onLeave={() => setHoveredProject(null)}
          onClick={handleNodeClick}
          corePosition={corePos}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.15}
        minDistance={5}
        maxDistance={18}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.2}
      />

    </>
  );
};

// --- MAIN COMPONENT ---

export const MissionIndex3D = ({ projects, onClose }: { projects: Project[]; onClose: () => void }) => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [glitchFlash, setGlitchFlash] = useState(false);
  const [scanLinePos, setScanLinePos] = useState(0);

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
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="absolute top-16 left-4 w-80 z-20"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-[#FF3B30]/30 rounded-sm overflow-hidden shadow-[0_0_30px_-10px_rgba(255,59,48,0.3)]">
              <div className="border-b border-[#FF3B30]/20 px-4 py-3 flex justify-between items-center bg-[#FF3B30]/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF3B30]" />
                  <span className="text-[11px] text-[#FF3B30] font-bold">{selectedProject.id}</span>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-neutral-500 hover:text-white text-xs px-2 py-0.5 hover:bg-white/10 rounded-sm transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <div className="text-[9px] text-neutral-600 uppercase tracking-wider mb-1">Codename</div>
                  <div className="text-lg text-white font-bold">{selectedProject.codename}</div>
                </div>

                <div>
                  <div className="text-[9px] text-neutral-600 uppercase tracking-wider mb-1">Objective</div>
                  <div className="text-[12px] text-neutral-300 leading-relaxed">{selectedProject.title}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[9px] text-neutral-600 uppercase tracking-wider mb-1">Status</div>
                    <div className={cn(
                      "text-[12px] font-bold",
                      selectedProject.status === "DEPLOYED" ? "text-emerald-400" :
                      selectedProject.status === "IN_PROGRESS" ? "text-amber-400" : "text-neutral-500"
                    )}>
                      {selectedProject.status}
                    </div>
                  </div>
                  {selectedProject.metrics?.[0] && (
                    <div>
                      <div className="text-[9px] text-neutral-600 uppercase tracking-wider mb-1">{selectedProject.metrics[0].label}</div>
                      <div className="text-[12px] text-white font-bold">{selectedProject.metrics[0].value}</div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-[9px] text-neutral-600 uppercase tracking-wider mb-2">Stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.stack.map(t => (
                      <span key={t} className="text-[9px] px-2 py-1 border border-white/10 text-neutral-400 bg-white/[0.03] rounded-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {(selectedProject.link || selectedProject.github) && (
                  <div className="pt-2 flex gap-2">
                    {selectedProject.link && (
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-[10px] py-2 bg-[#FF3B30] text-white font-bold uppercase tracking-wider hover:bg-[#FF3B30]/80 transition-colors rounded-sm"
                      >
                        View Demo
                      </a>
                    )}
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-[10px] py-2 border border-white/20 text-neutral-300 font-bold uppercase tracking-wider hover:bg-white/10 transition-colors rounded-sm"
                      >
                        Source
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Selector Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 right-0 bottom-0 w-80 z-30 bg-black/95 backdrop-blur-xl border-l border-white/10 flex flex-col"
          >
            <div className="border-b border-white/10 px-4 py-4 flex justify-between items-center bg-[#FF3B30]/5">
              <div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Mission Index</div>
                <div className="text-sm text-white font-bold">{projects.length} Projects</div>
              </div>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-neutral-500 hover:text-white text-lg px-2 py-1 hover:bg-white/10 rounded-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    setShowSidebar(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-white/5 transition-colors",
                    selectedProject?.id === project.id
                      ? "bg-[#FF3B30]/10 border-l-2 border-l-[#FF3B30]"
                      : "hover:bg-white/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-[10px] text-neutral-600 font-mono pt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded-sm font-mono",
                          project.status === "DEPLOYED" ? "bg-emerald-500/20 text-emerald-400" :
                          project.status === "IN_PROGRESS" ? "bg-amber-500/20 text-amber-400" :
                          "bg-neutral-500/20 text-neutral-400"
                        )}>
                          {project.status}
                        </span>
                      </div>
                      <div className="text-sm text-white font-medium mt-1">{project.codename}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5 truncate">{project.title}</div>
                      <div className="text-[9px] text-neutral-600 mt-1">{project.id}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 px-4 py-3 bg-black/50">
              <div className="text-[9px] text-neutral-600 text-center">
                SCROLL TO BROWSE • CLICK TO SELECT
              </div>
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
