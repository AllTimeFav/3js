import { Environment, OrbitControls, Sky, useAnimations, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import Floor from "../components/Florr"
import { MathUtils, Vector3 } from "three"
import BallNPC from "./Ball"


useGLTF.preload('/models/Adventurer.glb')

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[8, 12, 6]}
        intensity={1.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* Subtle sky/environment for realistic reflections */}
      <Sky distance={450000} sunPosition={[10, 20, 10]} turbidity={6} rayleigh={1} mieCoefficient={0.02} mieDirectionalG={0.8} inclination={0.49} />
      <Environment preset="city" />
    </>
  )
}

function Character({ forwardRef }) {
  const { scene, animations } = useGLTF('/models/Adventurer.glb')
  const { actions } = useAnimations(animations, scene)
  const ref = forwardRef
  const { camera } = useThree()
  const speed = 0.15
  const keys = useRef({})
  const cameraOffset = useRef(new Vector3(0, 5, 10))
  const minDistance = 5
  const maxDistance = 30
  const [isRunning, setIsRunning] = useState(false)
  const runMultiplier = 2
  
  useEffect(() => {
  const down = (e) => {
    keys.current[e.key.toLowerCase()] = true
    if (e.key === 'Shift') setIsRunning(true)
  }
  const up = (e) => {
    keys.current[e.key.toLowerCase()] = false
    if (e.key === 'Shift') setIsRunning(false)
  }
  window.addEventListener('keydown', down)
  window.addEventListener('keyup', up)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
  }
}, [])


  useEffect(() => {
    const handleWheel = (e) => {
      const offset = cameraOffset.current
      let newZ = offset.z + e.deltaY * 0.01 // adjust zoom sensitivity
      newZ = MathUtils.clamp(newZ, minDistance, maxDistance)
      cameraOffset.current.z = newZ
    }
    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useFrame(() => {
    if (!ref.current) return

    // Player movement (WASD)
    const dir = new Vector3()
    if (keys.current['w']) dir.z -= 1
    if (keys.current['s']) dir.z += 1
    if (keys.current['a']) dir.x -= 1
    if (keys.current['d']) dir.x += 1

    if (dir.length() > 0) {
      dir.normalize().multiplyScalar(isRunning ? speed * runMultiplier : speed)
      ref.current.position.add(dir)
      const targetRotation = Math.atan2(dir.x, dir.z)
      ref.current.rotation.y = MathUtils.lerp(ref.current.rotation.y, targetRotation, 0.2)
    }

    // Smooth follow camera
    const desiredPos = ref.current.position
      .clone()
      .add(new Vector3(0, cameraOffset.current.y, cameraOffset.current.z)
        .applyEuler(new Vector3(0, ref.current.rotation.y, 0)))

    camera.position.lerp(desiredPos, 0.1)
    camera.lookAt(ref.current.position)
  })

  return <primitive ref={ref} object={scene} scale={1.5} position={[0, 0, 0]} />
}


function BallManager({ playerRef, count = 5 }) {
  const colors = ['red', 'orange', 'yellow', 'purple', 'blue']
  const balls = Array.from({ length: count }, (_, i) => [
    (Math.random() - 0.5) * 50,
    1.5,
    (Math.random() - 0.5) * 50,
    colors[i % colors.length]
  ])
  return (
    <>
      {balls.map(([x, y, z, color], idx) => (
        <BallNPC key={idx} playerRef={playerRef} initialPosition={[x, y, z]} speed={0.05 + Math.random() * 0.03} color={color} />
      ))}
    </>
  )
}


const Scene = () => {
  const playerRef = useRef()

  return (
    <div className="h-screen w-screen bg-neutral-900">
      <div className="absolute z-10 left-4 top-4 rounded-2xl bg-neutral-800/70 px-4 py-2 shadow-lg backdrop-blur">
        <h1 className="text-white text-xl font-semibold">A Player running from Balls</h1>
        <p className="text-neutral-300 text-sm">WASD to move • Camera follows player</p>
      </div>

      <Canvas shadows dpr={[1, 2]} camera={{ position: [12, 8, 12], fov: 45 }}>
        <Suspense fallback={null}>
          <Lights />
          <Floor size={1000} color="#222" />
          <Character forwardRef={playerRef} />
          <BallManager playerRef={playerRef} count={5} />
          <OrbitControls
            target={playerRef.current?.position || [0, 0, 0]}
            maxDistance={30} // max zoom out
            minDistance={5}  // max zoom in
            enablePan={false} // lock panning
            enableRotate={true} // allow rotation around player
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Scene