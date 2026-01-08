"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, Linkedin, Mail, ExternalLink, Menu, X, Phone } from "lucide-react"
import type * as THREE from "three"
import { TextureLoader } from "three"

function CosmicRock() {
  const meshRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)
  const planet1Ref = useRef<THREE.Mesh>(null)
  const planet2Ref = useRef<THREE.Mesh>(null)
  
  // Load avatar texture
  const avatarTexture = useLoader(TextureLoader, "/avatar.jpeg")

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1
      meshRef.current.position.y = Math.sin(time * 0.4) * 0.3
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05
    }

    // Orbit planets around the center
    if (planet1Ref.current) {
      const orbitRadius = 3
      const orbitSpeed = 0.5
      planet1Ref.current.position.x = Math.cos(time * orbitSpeed) * orbitRadius
      planet1Ref.current.position.z = Math.sin(time * orbitSpeed) * orbitRadius
      planet1Ref.current.rotation.y = time * 0.3
    }

    if (planet2Ref.current) {
      const orbitRadius = 2.5
      const orbitSpeed = -0.7
      planet2Ref.current.position.x = Math.cos(time * orbitSpeed) * orbitRadius
      planet2Ref.current.position.y = Math.sin(time * 0.3) * 0.5
      planet2Ref.current.position.z = Math.sin(time * orbitSpeed) * orbitRadius
      planet2Ref.current.rotation.y = time * -0.2
    }
  })

  // Create particle positions for cosmic dust
  const particleCount = 200
  const positions = new Float32Array(particleCount * 3)
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  return (
    <group>
      {/* Cosmic dust particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#9333ea" transparent opacity={0.6} />
      </points>

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
        {/* Main avatar sphere - central object */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            map={avatarTexture}
            metalness={0.3}
            roughness={0.4}
            emissive="#9333ea"
            emissiveIntensity={0.1}
          />
          <Html position={[0, 0, 1.8]} center>
            <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm border border-accent/30">
              Cosmic Dev
            </div>
          </Html>
        </mesh>

        {/* Orbiting planet 1 - cyan */}
        <mesh ref={planet1Ref}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#312e81"
            metalness={0.8}
            roughness={0.4}
            emissive="#06b6d4"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Orbiting planet 2 - pink */}
        <mesh ref={planet2Ref}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#581c87"
            metalness={0.7}
            roughness={0.5}
            emissive="#ec4899"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>
    </group>
  )
}

// Navigation Component
function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="w-full max-w-none px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex justify-between items-center h-16">
          <div className="font-heading font-black text-xl text-primary">Portfolio</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {["home", "about", "experience", "projects", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-foreground hover:text-primary transition-colors capitalize font-medium"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Navigation Toggle */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

            {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["home", "about", "experience", "projects", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block px-3 py-2 text-foreground hover:text-primary transition-colors capitalize font-medium w-full text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
          <ambientLight intensity={0.3} color="#9333ea" />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ec4899" />
          <directionalLight position={[5, 5, 5]} intensity={0.4} color="#8b5cf6" />
          <CosmicRock />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 text-foreground">
          Cosmic
          <span className="text-primary block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Developer
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Crafting stellar web experiences across the digital universe with cutting-edge technologies
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="font-semibold cosmic-glow bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          >
            Explore My Universe
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="font-semibold bg-transparent border-primary/50 hover:bg-primary/10"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Make Contact
          </Button>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  const skills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "React.js",
    "Next.js",
    "Vue.js",
    "Node.js",
    "Express.js",
    "NestJS",
    "FastAPI",
    "Flask",
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "REST APIs",
    "WebSockets",
    "Git",
    "CI/CD",
  ]

  return (
    <section id="about" className="py-20 bg-muted/30 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 text-white">
            About This Cosmic Entity
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            A digital wanderer exploring the vast expanse of web technologies and 3D realms
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="p-8 cosmic-glow bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="space-y-6">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center cosmic-glow overflow-hidden border-4 border-primary/50">
                  <img
                    src="/avatar.jpeg"
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white leading-relaxed">
                  I traverse the digital cosmos, wielding React, Next.js, and Three.js to create immersive experiences
                  that bridge the gap between imagination and reality. My mission: to build applications that inspire
                  and connect beings across the universe.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-primary/50 hover:bg-primary/10 bg-transparent"
                    onClick={() => window.open("https://github.com/priyanshu0463", "_blank")}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-secondary/50 hover:bg-secondary/10 bg-transparent"
                    onClick={() => window.open("https://www.linkedin.com/in/priyanshukp0463", "_blank")}
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-accent/50 hover:bg-accent/10 bg-transparent"
                    onClick={() => window.location.href = "mailto:priyanshukp0463@gmail.com"}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-2xl font-heading font-bold mb-6 text-white">Cosmic Technologies & Skills</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="justify-center py-2 text-sm font-medium bg-primary/10 border-primary/30 hover:bg-primary/20 transition-colors text-white"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  const experiences = [
    {
      id: 1,
      title: "Software Development Engineer (SDE) Intern",
      company: "Dataequonix",
      duration: "Dec. 2023 - May 2025",
      achievements: [
        "Architected and developed high-performance messaging platform capable of processing 2 million messages daily, demonstrating expertise in scalable system design and performance optimization.",
        "Full-stack development proficiency across modern web technologies including React.js, Next.js, Vue.js for frontend development, and Node.js, PHP for backend services with PostgreSQL/MySQL database management.",
        "Cross-functional leadership seamlessly transitioning between business strategy, UI/UX design, and technical implementation roles to drive product success and deliver high-quality solutions.",
        "Collaborative team player with strong work ethic and adaptability, contributing significantly to team culture while consistently delivering impactful results across multiple project domains.",
      ],
      tech: ["Next.js", "React.js", "Vue.js", "Node.js", "PHP", "RabbitMQ", "MySQL", "Redis", "Docker", "AWS", "WebSockets"],
    },
  ]

  return (
    <section id="experience" className="py-20 bg-muted/30 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 text-white">
            Professional Experience
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            Journey through the digital cosmos - internships and professional milestones
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card
              key={exp.id}
              className="cosmic-glow bg-card/50 backdrop-blur-sm border-primary/20 hover:border-accent/50 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-heading font-bold text-white mb-2">
                      {exp.title}
                    </CardTitle>
                    <CardDescription className="text-lg text-white/80 font-semibold">
                      {exp.company}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-sm font-medium">{exp.duration}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-white/90 leading-relaxed">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2">●</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.tech.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="text-xs border-primary/30 bg-primary/5 text-white"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectsSection() {
  const [filter, setFilter] = useState("all")

  const projects = [
    {
      id: 1,
      title: "SwasthyaAI – AI-Powered AYUSH Health Platform",
      description: "AI-powered health platform delivering personalized AYUSH-based remedies and real-time doctor recommendations. Built with Next.js, Node.js, MongoDB, and integrated Gemini LLM for symptom analysis and SendGrid for automated health alerts.",
      category: "web",
      image: "/placeholder.svg?height=300&width=400",
      tech: ["Next.js", "Node.js", "MongoDB", "Google Maps API", "Gemini", "SendGrid", "TailwindCSS"],
      github: "https://github.com/priyanshu0463/SwasthyaAI",
      live: "#",
      date: "February 2025",
    },
    {
      id: 2,
      title: "Webcrawl – Real-Time Extension-Based Performance Crawler",
      description: "Real-time web crawler using Selenium, Scrapy, and Chrome Manifest V3 to simulate TCP/IP network conditions and benchmark website performance. Built with Python, integrating ML models for anomaly detection and performance scoring.",
      category: "web",
      image: "/placeholder.svg?height=300&width=400",
      tech: ["Python", "Selenium", "Scrapy", "Manifest V3", "Scikit-learn", "PyTest", "TCP/IP Simulation Tools", "HTML/CSS/JS"],
      github: "https://github.com/priyanshu0463/Webcrawl",
      live: "#",
      date: "June 2025",
    },
    {
      id: 3,
      title: "GeoStep – Interactive Route Finder",
      description: "Flutter application for finding routes between current location and marked points on a map. Leverages OpenStreetMap (OSM) for interactive and customizable mapping experience with intuitive navigation.",
      category: "mobile",
      image: "/placeholder.svg?height=300&width=400",
      tech: ["Flutter", "OpenStreetMap", "Dart", "Geolocation"],
      github: "https://github.com/priyanshu0463/geostep.git",
      live: "#",
      date: "2025",
    },
  ]

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter)

  return (
    <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 text-white">Cosmic Creations</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            A constellation of projects spanning across digital galaxies
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {["all", "web", "mobile"].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className={`capitalize font-medium ${
                filter === category
                  ? "cosmic-glow bg-gradient-to-r from-primary to-accent"
                  : "border-primary/50 hover:bg-primary/10"
              }`}
            >
              {category === "all" ? "All Galaxies" : category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-lg transition-all duration-300 cosmic-glow bg-card/50 backdrop-blur-sm border-primary/20 hover:border-accent/50"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-4 pb-4">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-primary/90 hover:bg-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.github, "_blank")
                    }}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  {project.live !== "#" && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="bg-accent/90 hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(project.live, "_blank")
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Launch
                    </Button>
                  )}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="font-heading font-bold text-white flex-1">{project.title}</CardTitle>
                  {project.date && (
                    <span className="text-xs text-white/60 whitespace-nowrap">{project.date}</span>
                  )}
                </div>
                <CardDescription className="leading-relaxed text-white/80 text-sm">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-primary/30 bg-primary/5 text-white">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-muted/30 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-black mb-4 text-white">Establish Communication</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Ready to embark on a cosmic journey together? Send a transmission across the digital void
          </p>
        </div>

        <Card className="p-8 cosmic-glow bg-card/50 backdrop-blur-sm border-primary/20">
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-heading font-bold text-white mb-6">Get In Touch</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white">
                <a
                  href="mailto:priyanshukp0463@gmail.com"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>priyanshukp0463@gmail.com</span>
                </a>
                <a
                  href="tel:+917903473235"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>+91-7903473235</span>
                </a>
              </div>
              <div className="flex items-center justify-center gap-6 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/50 hover:bg-primary/10 bg-transparent text-white"
                  onClick={() => window.open("https://github.com/priyanshu0463", "_blank")}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-secondary/50 hover:bg-secondary/10 bg-transparent text-white"
                  onClick={() => window.open("https://www.linkedin.com/in/priyanshukp0463", "_blank")}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>

            <div className="border-t border-primary/20 pt-8">
              <h3 className="text-xl font-heading font-bold text-white mb-6">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Name</label>
                    <Input placeholder="Your name" className="bg-input/50 border-primary/30 focus:border-accent text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Email</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      className="bg-input/50 border-primary/30 focus:border-accent text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Subject</label>
                  <Input
                    placeholder="What's this about?"
                    className="bg-input/50 border-primary/30 focus:border-accent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Message</label>
                  <Textarea
                    placeholder="Tell me about your project or just say hello..."
                    rows={6}
                    className="bg-input/50 border-primary/30 focus:border-accent text-white"
                  />
                </div>
                <Button
                  size="lg"
                  className="w-full font-semibold cosmic-glow bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 border-t border-primary/20 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-heading font-black text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cosmic Portfolio
          </div>
          <div className="flex gap-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-primary/10 hover:text-primary"
              onClick={() => window.open("https://github.com/priyanshu0463", "_blank")}
            >
              <Github className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-secondary/10 hover:text-secondary"
              onClick={() => window.open("https://www.linkedin.com/in/priyanshukp0463", "_blank")}
            >
              <Linkedin className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-accent/10 hover:text-accent"
              onClick={() => window.location.href = "mailto:priyanshukp0463@gmail.com"}
            >
              <Mail className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Cosmic Entity. Exploring the digital universe.</p>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function Portfolio() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
