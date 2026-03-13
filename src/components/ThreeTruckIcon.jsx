import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, RoundedBox } from "@react-three/drei";

const BODY_DARK = "#2d2d3a";
const BODY_MID = "#3a3a4a";
const ORANGE = "#e8a04c";
const DARK_ORANGE = "#c47a28";
const WHEEL_RUBBER = "#111118";
const RIM_SILVER = "#b8b8c0";
const GLASS = "#5a8a9a";
const CHROME = "#d8d8e0";
const EXHAUST = "#555560";

function Wheel({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.28, 0.12, 12, 24]} />
        <meshStandardMaterial color={WHEEL_RUBBER} roughness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.22, 32]} />
        <meshStandardMaterial color={WHEEL_RUBBER} roughness={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.24, 32]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.25, 24]} />
        <meshStandardMaterial color={RIM_SILVER} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.13, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.02, 16]} />
        <meshStandardMaterial color={ORANGE} metalness={0.5} roughness={0.3} />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.15, 0.13, Math.sin(angle) * 0.15]} castShadow receiveShadow>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.1} />
          </mesh>
        );
      })}
    </group>
  );
}

function Truck() {
  return (
    <group position={[0, -1, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <RoundedBox args={[3.2, 1.9, 2.0]} radius={0.04} position={[0.6, 1.35, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={ORANGE} roughness={0.3} metalness={0.08} />
      </RoundedBox>

      {Array.from({ length: 14 }, (_, index) => (
        <RoundedBox
          key={`front_side_${index}`}
          args={[0.04, 1.85, 0.04]}
          radius={0.01}
          position={[-0.8 + index * 0.24, 1.35, 1.02]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={DARK_ORANGE} roughness={0.35} />
        </RoundedBox>
      ))}
      {Array.from({ length: 14 }, (_, index) => (
        <RoundedBox
          key={`rear_side_${index}`}
          args={[0.04, 1.85, 0.04]}
          radius={0.01}
          position={[-0.8 + index * 0.24, 1.35, -1.02]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={DARK_ORANGE} roughness={0.35} />
        </RoundedBox>
      ))}

      {Array.from({ length: 14 }, (_, index) => (
        <RoundedBox
          key={`top_ridge_${index}`}
          args={[0.04, 0.04, 1.95]}
          radius={0.01}
          position={[-0.8 + index * 0.24, 2.32, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={DARK_ORANGE} roughness={0.35} />
        </RoundedBox>
      ))}

      <RoundedBox args={[3.25, 0.08, 2.05]} radius={0.02} position={[0.6, 0.38, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={BODY_DARK} roughness={0.5} metalness={0.2} />
      </RoundedBox>
      <RoundedBox args={[3.25, 0.06, 2.05]} radius={0.02} position={[0.6, 2.32, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={DARK_ORANGE} roughness={0.4} />
      </RoundedBox>

      <RoundedBox args={[1.6, 1.0, 2.0]} radius={0.12} position={[-1.55, 0.9, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={BODY_DARK} roughness={0.35} metalness={0.15} />
      </RoundedBox>
      <RoundedBox args={[1.3, 0.55, 1.9]} radius={0.12} position={[-1.45, 1.65, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={BODY_MID} roughness={0.35} metalness={0.15} />
      </RoundedBox>
      <RoundedBox args={[1.2, 0.08, 1.85]} radius={0.04} position={[-1.45, 1.95, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={BODY_DARK} roughness={0.4} metalness={0.2} />
      </RoundedBox>

      <mesh position={[-2.36, 1.45, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.03, 0.75, 1.55]} />
        <meshPhysicalMaterial color={GLASS} transparent opacity={0.4} metalness={0.3} roughness={0.05} clearcoat={1} />
      </mesh>

      {[1, -1].map((side) => (
        <mesh key={side} position={[-1.5, 1.6, side * 0.96]} castShadow>
          <boxGeometry args={[0.85, 0.4, 0.03]} />
          <meshPhysicalMaterial color={GLASS} transparent opacity={0.35} metalness={0.3} roughness={0.05} clearcoat={1} />
        </mesh>
      ))}

      <RoundedBox args={[0.6, 0.55, 1.9]} radius={0.08} position={[-2.2, 0.67, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={BODY_DARK} roughness={0.35} metalness={0.15} />
      </RoundedBox>

      <RoundedBox args={[0.06, 0.5, 1.6]} radius={0.02} position={[-2.52, 0.65, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={ORANGE} roughness={0.35} metalness={0.15} />
      </RoundedBox>
      {Array.from({ length: 5 }, (_, index) => (
        <RoundedBox key={`grille_slat_${index}`} args={[0.07, 0.03, 1.5]} radius={0.01} position={[-2.53, 0.48 + index * 0.1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={BODY_DARK} roughness={0.4} />
        </RoundedBox>
      ))}

      {[-0.6, 0.6].map((z) => (
        <group key={z} position={[-2.54, 0.5, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.15, 0.25]} />
            <meshStandardMaterial color={BODY_DARK} roughness={0.3} metalness={0.3} />
          </mesh>
          <mesh position={[-0.02, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.02, 0.1, 0.18]} />
            <meshStandardMaterial color="#ffffee" emissive="#fff5dd" emissiveIntensity={0.3} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      <RoundedBox args={[0.15, 0.18, 2.0]} radius={0.04} position={[-2.55, 0.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={BODY_DARK} roughness={0.45} metalness={0.25} />
      </RoundedBox>

      <mesh position={[-2.56, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 0.1, 0.3]} />
        <meshStandardMaterial color="#eeeee8" roughness={0.3} />
      </mesh>

      {[1, -1].map((side) => (
        <group key={`mirror_${side}`} position={[-2.0, 1.4, side * 1.15]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.04, 0.2]} />
            <meshStandardMaterial color={BODY_DARK} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.05, side * 0.08]} castShadow receiveShadow>
            <boxGeometry args={[0.12, 0.15, 0.03]} />
            <meshStandardMaterial color={BODY_DARK} roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      ))}

      <RoundedBox args={[5.0, 0.2, 1.6]} radius={0.03} position={[-0.15, 0.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={BODY_DARK} roughness={0.5} metalness={0.25} />
      </RoundedBox>

      {[1, -1].map((side) => (
        <RoundedBox key={`chassis_rail_${side}`} args={[4.8, 0.15, 0.06]} radius={0.02} position={[-0.15, 0.22, side * 0.65]} castShadow receiveShadow>
          <meshStandardMaterial color={BODY_DARK} roughness={0.5} metalness={0.2} />
        </RoundedBox>
      ))}

      <group position={[-0.3, 0.22, -0.9]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.55, 16]} />
          <meshStandardMaterial color={BODY_MID} roughness={0.4} metalness={0.3} />
        </mesh>
        {[-0.15, 0.15].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <torusGeometry args={[0.19, 0.015, 8, 16]} />
            <meshStandardMaterial color={CHROME} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      <RoundedBox args={[0.35, 0.25, 0.25]} radius={0.03} position={[-0.3, 0.2, 0.88]} castShadow receiveShadow>
        <meshStandardMaterial color={BODY_DARK} roughness={0.5} metalness={0.2} />
      </RoundedBox>

      <group position={[-1.0, 1.2, -1.08]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.07, 1.8, 12]} />
          <meshStandardMaterial color={EXHAUST} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.075, 0.06, 0.12, 12]} />
          <meshStandardMaterial color={EXHAUST} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {[1, -1].map((side) => (
        <group key={`mud_flap_${side}`}>
          <mesh position={[-1.25, 0.05, side * 0.85]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.3, 0.02]} />
            <meshStandardMaterial color={WHEEL_RUBBER} roughness={0.9} />
          </mesh>
          <mesh position={[1.85, 0.05, side * 0.85]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.3, 0.02]} />
            <meshStandardMaterial color={WHEEL_RUBBER} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {[-0.7, 0.7].map((z) => (
        <mesh key={`rear_light_${z}`} position={[2.22, 0.6, z]} castShadow receiveShadow>
          <boxGeometry args={[0.03, 0.12, 0.15]} />
          <meshStandardMaterial color="#cc2222" emissive="#aa0000" emissiveIntensity={0.2} />
        </mesh>
      ))}

      <Wheel position={[-1.7, 0.0, 1.08]} />
      <Wheel position={[-1.7, 0.0, -1.08]} />
      <Wheel position={[1.0, 0.0, 1.08]} />
      <Wheel position={[1.0, 0.0, -1.08]} />
      <Wheel position={[1.65, 0.0, 1.08]} />
      <Wheel position={[1.65, 0.0, -1.08]} />

      {[1, -1].map((side) => (
        <RoundedBox key={`front_fender_${side}`} args={[0.7, 0.08, 0.15]} radius={0.02} position={[-1.7, 0.42, side * 0.95]} castShadow receiveShadow>
          <meshStandardMaterial color={BODY_DARK} roughness={0.4} metalness={0.2} />
        </RoundedBox>
      ))}
    </group>
  );
}

export default function ThreeTruckIcon({ size = 56 }) {
  const dimension = Math.round(size);

  return (
    <div style={{ width: dimension, height: dimension, pointerEvents: "none" }}>
      <Canvas
        orthographic
        camera={{ position: [0, 8.2, 0.001], zoom: 82, near: 0.1, far: 50, up: [0, 0, -1] }}
        dpr={[1, 1.6]}
        frameloop="demand"
        shadows
        style={{ width: "100%", height: "100%", display: "block" }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.02;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.58} />
        <directionalLight position={[6, 10, 4]} intensity={1.35} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <directionalLight position={[-5, 7, -3]} intensity={0.45} color="#c8d8ff" />
        <pointLight position={[0, 6, 0]} intensity={0.22} color="#ffeedd" />
        <Environment preset="city" />
        <Truck />
      </Canvas>
    </div>
  );
}
