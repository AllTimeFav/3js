import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Vector3 } from "three"

const BallNPC = ({ playerRef, initialPosition = [0, 0, 0], speed = 0.02, color = "red" }) => {
  const ref = useRef()
  const fixedHeight = initialPosition[1]

  useFrame(() => {
    if (!ref.current || !playerRef.current) return
    const dir = new Vector3()
      .subVectors(playerRef.current.position.clone().setY(fixedHeight), ref.current.position.clone().setY(fixedHeight))
      .normalize()
      .multiplyScalar(speed)
    ref.current.position.add(dir)
    ref.current.position.y = fixedHeight
    ref.current.lookAt(playerRef.current.position.x, fixedHeight, playerRef.current.position.z)
  })

  return (
    <mesh ref={ref} position={initialPosition} castShadow>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
    </mesh>
  )
}
export default BallNPC;