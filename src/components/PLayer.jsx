import { useAnimations, useGLTF } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { MathUtils, Vector3 } from "three"

const Player = ({ forwardRef }) => {
  const { scene, animations } = useGLTF('/models/Adventurer.glb')
  const { actions } = useAnimations(animations, scene)
  const ref = forwardRef 
  const { camera, mouse } = useThree()
  const keys = useRef({})
  const speed = 0.15
  const runMultiplier = 2
  const cameraOffset = new Vector3(0, 5, 10)

  const [isRunning, setIsRunning] = useState(false)

  // Input handlers
  useEffect(() => {
    const down = (e) => {
      keys.current[e.key.toLowerCase()] = true
      if (e.shiftKey) setIsRunning(true)
    }
    const up = (e) => {
      keys.current[e.key.toLowerCase()] = false
      if (!e.shiftKey) setIsRunning(false)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame(() => {
    if (!ref.current) return

    // Compute movement vector
    const dir = new Vector3()
    if (keys.current['w']) dir.z -= 1
    if (keys.current['s']) dir.z += 1
    if (keys.current['a']) dir.x -= 1
    if (keys.current['d']) dir.x += 1

    const moveSpeed = isRunning ? speed * runMultiplier : speed

    if (dir.length() > 0) {
      dir.normalize().multiplyScalar(moveSpeed)
      ref.current.position.add(dir)

      // Rotate toward movement
      const targetRot = Math.atan2(dir.x, dir.z)
      ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRot, 0.2)

      // Play animation
      if (isRunning && actions['Run']) actions['Run'].play()
      else if (actions['Walk']) actions['Walk'].play()
      if (actions['Idle']) actions['Idle'].stop()
    } else {
      if (actions['Idle']) actions['Idle'].play()
      if (actions['Walk']) actions['Walk'].stop()
      if (actions['Run']) actions['Run'].stop()
    }

    // Camera follow (third-person)
    const desiredPos = ref.current.position.clone().add(cameraOffset.clone().applyEuler(new Vector3(0, ref.current.rotation.y, 0)))
    camera.position.lerp(desiredPos, 0.1)
    camera.lookAt(ref.current.position)
  })

  return <primitive ref={ref} object={scene} scale={1.5} position={[0, 0, 0]} />
}

export default Player;