"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

function Geometry() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        // Smooth rotation based on time
        meshRef.current.rotation.x = Math.cos(t / 4) / 2;
        meshRef.current.rotation.y = Math.sin(t / 4) / 2;
        meshRef.current.rotation.z = Math.sin(t / 1.5) / 2;

        // Mouse interaction influence
        const x = state.pointer.x;
        const y = state.pointer.y;

        meshRef.current.rotation.x += y * 0.2;
        meshRef.current.rotation.y += x * 0.2;
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} scale={1.8}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="#444"
                    emissive="#000"
                    metalness={0.9}
                    roughness={0.1}
                    wireframe={true}
                />
            </mesh>
            <mesh scale={1.79}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="#000"
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </Float>
    );
}

export default function Scene3D() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full opacity-60">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#666" />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#4040ff" />
                <Geometry />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
