import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function InteractiveSphere({ position = [0, 0, 0] }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.01
    ref.current.position.y = 2 + Math.sin(clock.getElapsedTime()) * 0.5
  })
  return (
    <mesh ref={ref} position={position} castShadow>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="orange" roughness={0.5} metalness={0.5} />
    </mesh>
  )
}
