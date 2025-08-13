import { Grid } from "@react-three/drei";

const Floor = ({ size = 1000, color = '#2a2a2a', roughness = 1, metalness = 0 }) => {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[size, size, 1, 1]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>
      <Grid
        infiniteGrid
        fadeDistance={200}
        fadeStrength={3}
        cellSize={1}
        cellThickness={0.5}
        sectionSize={10}
        sectionThickness={1}
        position={[0, 0.001, 0]}
      />
    </group>
  )
}

export default Floor;

