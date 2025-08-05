'use client'

import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Suspense, useState } from 'react'
import { useRef } from 'react'

// 3D Model Component with rotation
function Model3D() {
  const gltf = useLoader(GLTFLoader, '/uranus.glb')
  const modelRef = useRef()
  
  // Add rotation animation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5 // Rotate at 0.5 radians per second
    }
  })
  
  return (
    <primitive 
      ref={modelRef}
      object={gltf.scene} 
      scale={[2.5, 2.5, 2.5]}
      position={[0, 0, 0]}
    />
  )
}

// Loading fallback for the 3D model
function ModelLoader() {
  const meshRef = useRef()
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.5
    }
  })
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#0066ff" />
    </mesh>
  )
}

export default function LoadingScreen({ onEnterApp }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEnterApp = () => {
    setIsLoading(true)
    // Simulate loading time
    setTimeout(() => {
      if (onEnterApp) {
        onEnterApp()
      }
    }, 1500)
  }

  return (
    <div id="loading-screen">
      <div className="loading-content">
        <div className="model-container">
          <Canvas
            camera={{ position: [0, 0, 12], fov: 45 }}
            style={{ 
              width: '400px', 
              height: '400px',
              background: 'transparent'
            }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, -5, -5]} intensity={0.5} />
            <pointLight position={[0, 10, 0]} intensity={0.3} />
            
            <Suspense fallback={<ModelLoader />}>
              <Model3D />
            </Suspense>
          </Canvas>
        </div>
        
        <h1 className="welcome-title">Welcome to Uranus Analytics</h1>
        <p className="welcome-subtitle">Explore the future of token analytics</p>
        
        {!isLoading ? (
          <button 
            className="enter-app-btn"
            onClick={handleEnterApp}
          >
            Enter App
          </button>
        ) : (
          <div className="loading-spinner"></div>
        )}
        
        {isLoading && (
          <div className="loading-text">
            <h2>Initializing Analytics</h2>
            <p>Establishing secure connection to UrAnus</p>
          </div>
        )}
      </div>
    </div>
  )
} 