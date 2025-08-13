import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

const AnimatedBackground = () => {
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.002
  })

  return (
    <group ref={groupRef}>
      {[...Array(50)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 10 + 2,
            (Math.random() - 0.5) * 50
          ]}
        >
          <sphereGeometry args={[Math.random() * 0.5 + 0.1, 16, 16]} />
          <meshStandardMaterial color={`hsl(${Math.random() * 360}, 50%, 50%)`} />
        </mesh>
      ))}
    </group>
  )
}

export default AnimatedBackground;
