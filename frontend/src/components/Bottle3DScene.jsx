/**
 * Procedural 3D bottle scene built with React Three Fiber.
 *
 * Composition (from bottom to top):
 *   - Dark amber glass body (cylinder with subtle taper at neck)
 *   - Black wrap-around label band on the body middle
 *   - Narrower neck (cylinder)
 *   - Gold cap (cylinder, slightly metallic)
 *
 * Cursor drag rotates the bottle (OrbitControls). Idle = slow auto-rotate.
 */
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'

function Bottle() {
  const groupRef = useRef()

  // Idle auto-spin — feels alive even when nobody's interacting
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Main body — dark amber glass */}
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 2.2, 64]} />
        <meshPhysicalMaterial
          color="#1f1108"
          metalness={0.05}
          roughness={0.25}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* Slight rounded shoulder where body narrows into neck */}
      <mesh castShadow position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.45, 0.85, 0.25, 64]} />
        <meshPhysicalMaterial
          color="#1f1108"
          metalness={0.05}
          roughness={0.28}
          clearcoat={0.5}
        />
      </mesh>

      {/* Neck */}
      <mesh castShadow position={[0, 2.32, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.35, 48]} />
        <meshPhysicalMaterial
          color="#1f1108"
          metalness={0.05}
          roughness={0.25}
          clearcoat={0.6}
        />
      </mesh>

      {/* Gold cap */}
      <mesh castShadow position={[0, 2.7, 0]}>
        <cylinderGeometry args={[0.48, 0.45, 0.45, 48]} />
        <meshStandardMaterial
          color="#d6a85a"
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Cap top — slightly darker amber dome feel */}
      <mesh castShadow position={[0, 2.93, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.02, 48]} />
        <meshStandardMaterial
          color="#b88b3f"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Black wrap label — slightly larger radius than body so it stands proud */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.86, 0.86, 1.1, 64, 1, true]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.05}
          roughness={0.7}
          side={2}
        />
      </mesh>

      {/* Amber accent band — top of label */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.861, 0.861, 0.06, 64, 1, true]} />
        <meshStandardMaterial
          color="#d6a85a"
          metalness={0.4}
          roughness={0.4}
          side={2}
          emissive="#d6a85a"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Amber accent band — bottom of label */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.861, 0.861, 0.04, 64, 1, true]} />
        <meshStandardMaterial
          color="#d6a85a"
          metalness={0.4}
          roughness={0.4}
          side={2}
          emissive="#d6a85a"
          emissiveIntensity={0.12}
        />
      </mesh>
    </group>
  )
}

export default function Bottle3DScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.2, 5.5], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 3, 2]} intensity={0.4} color="#d6a85a" />
      <pointLight position={[0, 2, 4]} intensity={0.5} color="#ffd28a" />

      <Suspense fallback={null}>
        <Bottle />
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.55}
          scale={6}
          blur={2.6}
          far={4}
          color="#000000"
        />
        <Environment preset="city" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.8}
        rotateSpeed={0.7}
      />
    </Canvas>
  )
}
