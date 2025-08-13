import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Text3D, DragControls } from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Code, Cpu, Globe, Mail, MessageCircle, Phone } from "lucide-react"
import { Link } from "react-router"

// Animated 3D Model Component
function AnimatedModel() {
  const meshRef = useRef(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.8}
          roughness={0.2}
          emissive="#1e40af"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  )
}

// Floating Particles
function Particles() {
  const particlesRef = useRef(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const particleCount = 100
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#60a5fa" transparent opacity={0.6} />
    </points>
  )
}

function DraggableText() {
  const textGroupRef = useRef()
  const textRef = useRef()
  const [objects, setObjects] = useState([])

  useEffect(() => {
    if (textGroupRef.current) {
      setObjects([textGroupRef.current])
    }
  }, [])

  return (
    <>
      <DragControls transformGroup objects={objects} />
      <group ref={textGroupRef}>
        <Text3D
          ref={textRef}
          font="https://drei.pmnd.rs/fonts/helvetiker_regular.typeface.json"
          size={0.8}
          height={0.1}
          position={[-2.4, 2.5, -2]}
          rotation={[0, 0.2, 0]}
        >
          RODEXCO
          <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.3} />
        </Text3D>
      </group>
    </>
  )
}

// 3D Scene Component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />

      <AnimatedModel />
      <Particles />
      <DraggableText />

      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
    </>
  )
}

// Service Card Component
function ServiceCard({ icon: Icon, title, description }) {
  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10 hover:bg-black/30 transition-all duration-300 group">
      <CardContent className="p-6">
        <Icon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 w-full h-screen">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              Software Innovation
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Transforming ideas into cutting-edge software solutions with immersive 3D experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo" className="cursor-pointer">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Try Demo{" "}
                  <ArrowRight
                    className={`ml-2 transition-transform ${isHovered ? "translate-x-1" : ""}`}
                  />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <ServiceCard
                icon={Code}
                title="Custom Software Development"
                description="Tailored software solutions built with cutting-edge technologies to meet your unique business needs."
              />
              <ServiceCard
                icon={Globe}
                title="3D Web Experiences"
                description="Immersive 3D web applications that engage users and showcase your products in stunning detail."
              />
              <ServiceCard
                icon={Cpu}
                title="AI Integration"
                description="Intelligent automation and AI-powered features to streamline your business processes."
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">About Rodexco</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              We are a forward-thinking software company specializing in innovative digital solutions. Our team combines
              technical expertise with creative vision to deliver exceptional software experiences that drive business
              growth and user engagement.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                <div className="text-gray-300">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">5+</div>
                <div className="text-gray-300">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-gray-300">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="py-16 px-6 bg-black/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold mb-6">Get In Touch</h3>
                <p className="text-gray-300 mb-8">
                  Ready to transform your ideas into reality? Let's discuss your next project.
                </p>
                <Link to='/demo' className="cursor-pointer">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Try Demo <ArrowRight className="ml-2" />
                </Button>
                </Link>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-6">Contact Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span>hello@rodexco.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                    <span>+92 329 4380247</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <span>+92 329 4380247</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Rodexco Software Company. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}