import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function InteractiveBox({ position = [0, 0, 0] }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01
    ref.current.position.y = 1 + Math.sin(clock.getElapsedTime()) * 0.3
  })
  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="skyblue" roughness={0.5} metalness={0.5} />
    </mesh>
  )
}
