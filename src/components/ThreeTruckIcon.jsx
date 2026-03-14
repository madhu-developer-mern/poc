import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";

// Premium Color Palette
const COLORS = {
  CABIN_PRIMARY: "#2563eb", // Vibrant Logistics Blue
  CABIN_SECONDARY: "#1d4ed8",
  CONTAINER_WHITE: "#f8fafc",
  CHASSIS_DARK: "#0f172a",
  CHROME: "#f1f5f9",
  GLASS_BLUE: "#bae6fd",
  TIRE: "#020617",
  HUB_SILVER: "#94a3b8",
  TAIL_LIGHT: "#ef4444",
  HEAD_LIGHT: "#ffffff",
};

function Wheel({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, 0, rotation]}>
      {/* Tire Rubber */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.24, 32]} />
        <meshStandardMaterial color={COLORS.TIRE} roughness={0.9} />
      </mesh>
      {/* Inner Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.26, 24]} />
        <meshStandardMaterial color={COLORS.HUB_SILVER} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Hub Cap with Bolts */}
      <group position={[0, 0, 0.14]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
          <meshStandardMaterial color={COLORS.CHROME} metalness={1} roughness={0.1} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh 
            key={i} 
            position={[Math.cos(i * Math.PI / 3) * 0.06, Math.sin(i * Math.PI / 3) * 0.06, 0.02]} 
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.02, 6]} />
            <meshStandardMaterial color={COLORS.CHROME} metalness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function TruckModel() {
  return (
    <group position={[0, -0.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Chassis Main Frame */}
      <RoundedBox args={[4.6, 0.18, 0.9]} radius={0.02} position={[0, 0.2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={COLORS.CHASSIS_DARK} roughness={0.6} />
      </RoundedBox>

      {/* Cabin Unit */}
      <group position={[-1.7, 0.5, 0]}>
        {/* Main Cabin Shell */}
        <RoundedBox args={[1.3, 1.2, 1.8]} radius={0.12} position={[0, 0.4, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color={COLORS.CABIN_PRIMARY} 
            roughness={0.1} 
            metalness={0.2} 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
          />
        </RoundedBox>
        
        {/* Roof Aerodynamics */}
        <RoundedBox args={[1.2, 0.6, 1.7]} radius={0.2} position={[0, 1.1, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial 
            color={COLORS.CABIN_PRIMARY} 
            roughness={0.1} 
            clearcoat={0.8}
          />
        </RoundedBox>

        {/* Windshield */}
        <mesh position={[-0.66, 0.9, 0]} rotation={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.02, 0.75, 1.55]} />
          <meshPhysicalMaterial 
            color={COLORS.GLASS_BLUE} 
            transparent 
            opacity={0.4} 
            metalness={0.9} 
            roughness={0.05} 
            transmission={0.95}
            thickness={0.2}
          />
        </mesh>

        {/* Side Windows */}
        {[0.91, -0.91].map((z) => (
          <mesh key={z} position={[0, 0.9, z]} castShadow>
            <boxGeometry args={[0.7, 0.55, 0.02]} />
            <meshPhysicalMaterial color={COLORS.GLASS_BLUE} transparent opacity={0.4} metalness={0.9} roughness={0.05} />
          </mesh>
        ))}

        {/* Chrome Front Grill */}
        <group position={[-0.67, 0.3, 0]}>
          <RoundedBox args={[0.04, 0.65, 1.3]} radius={0.02} castShadow receiveShadow>
            <meshStandardMaterial color={COLORS.CHASSIS_DARK} roughness={0.4} />
          </RoundedBox>
          {[0.2, 0.1, 0, -0.1, -0.2].map((y, i) => (
            <mesh key={i} position={[0.03, y, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.02, 0.03, 1.1]} />
              <meshStandardMaterial color={COLORS.CHROME} metalness={1} roughness={0.1} />
            </mesh>
          ))}
        </group>

        {/* Headlights with Glow */}
        {[0.68, -0.68].map((z) => (
          <group key={z} position={[-0.68, 0.15, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.05, 0.18, 0.3]} />
              <meshStandardMaterial color={COLORS.CHROME} metalness={1} />
            </mesh>
            <mesh position={[-0.03, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[0.09, 16]} />
              <meshStandardMaterial color={COLORS.HEAD_LIGHT} emissive={COLORS.HEAD_LIGHT} emissiveIntensity={2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Cargo Container */}
      <group position={[0.6, 1.35, 0]}>
        <RoundedBox args={[3.2, 2.1, 1.95]} radius={0.04} castShadow receiveShadow>
          <meshPhysicalMaterial color={COLORS.CONTAINER_WHITE} roughness={0.2} metalness={0.02} />
        </RoundedBox>
        {/* Container Ridges for Realism */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[-1.48 + i * 0.27, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.03, 2.15, 1.98]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.5} opacity={0.6} transparent />
          </mesh>
        ))}
        {/* Top Rail */}
        <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.25, 0.05, 2.0]} />
          <meshStandardMaterial color={COLORS.CHROME} metalness={0.5} />
        </mesh>
      </group>

      {/* Side View Mirrors */}
      {[1.05, -1.05].map((z) => (
        <group key={z} position={[-1.9, 1.5, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.04, 0.22]} />
            <meshStandardMaterial color={COLORS.CHASSIS_DARK} />
          </mesh>
          <mesh position={[0, -0.15, z * 0.08]} castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.25, 0.02]} />
            <meshPhysicalMaterial color={COLORS.CABIN_PRIMARY} roughness={0.05} metalness={0.3} clearcoat={1} />
          </mesh>
        </group>
      ))}

      {/* Exhaust Stacks */}
      {[0.8, -0.8].map((z) => (
        <mesh key={z} position={[-0.9, 1.7, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.07, 0.07, 2.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.1} />
        </mesh>
      ))}

      {/* Rear Tail Lights */}
      {[0.75, -0.75].map((z) => (
        <mesh key={z} position={[2.22, 0.35, z]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.15, 0.25]} />
          <meshStandardMaterial color={COLORS.TAIL_LIGHT} emissive={COLORS.TAIL_LIGHT} emissiveIntensity={0.8} />
        </mesh>
      ))}

      {/* Wheels Positioning */}
      <Wheel position={[-1.45, 0.1, 0.7]} rotation={0} />
      <Wheel position={[-1.45, 0.1, -0.7]} rotation={Math.PI} />
      
      <Wheel position={[0.7, 0.1, 0.7]} rotation={0} />
      <Wheel position={[0.7, 0.1, -0.7]} rotation={Math.PI} />
      
      <Wheel position={[1.4, 0.1, 0.7]} rotation={0} />
      <Wheel position={[1.4, 0.1, -0.7]} rotation={Math.PI} />

      {/* Anti-Gravity Chassis Shadow */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 2]} />
        <meshBasicMaterial color="#000" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function ThreeTruckIcon({ size = 64, rotation = 0 }) {
  const dimension = Math.round(size);

  return (
    <div style={{ width: dimension, height: dimension, pointerEvents: "none" }}>
      <Canvas
        orthographic
        camera={{ position: [6, 4, 6], zoom: 60, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        frameloop="demand"
        shadows
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{ alpha: true, antialias: true, stencil: false }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
        }}
      >
        <ambientLight intensity={0.6} />
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#e0f2fe" />
        <pointLight position={[0, 5, 0]} intensity={0.3} color="#fff" />
        <Environment preset="city" />
        <group rotation={[0, -rotation * (Math.PI / 180), 0]}>
          <TruckModel />
        </group>
      </Canvas>
    </div>
  );
}
