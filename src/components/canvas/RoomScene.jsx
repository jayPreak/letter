'use client'

import { Html, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Change this to your room file in /public (example: '/my-room.glb')
const ROOM_MODEL_PATH = '/room.glb'
const LETTER_MODEL_PATH = '/letter.glb'

// Camera tuning values you can edit
const CAMERA_BASE_POSITION = [-2.5, 1.5, 6]
const CAMERA_TARGET_POSITION = [-1.5, 0.9, 1.1]
const CAMERA_MOVE_SPEED = 0.3
const CAMERA_STOP_EPSILON = 0.02
const CAMERA_LOOK_AT = [-0.66, 0.27, 0]
const LETTER_POSITION = CAMERA_LOOK_AT
const LETTER_ROTATION = [-Math.PI / 2, (Math.PI / 2) + 1.3, Math.PI / 2]
const LETTER_SCALE = 0.1
const LETTER_INDICATOR_OFFSET_Y = 0.38
const LETTER_INDICATOR_SCALE = 0.24

function RoomModel(props) {
  const { scene } = useGLTF(ROOM_MODEL_PATH)

  const clone = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
    return cloned
  }, [scene])

  return <primitive object={clone} {...props} />
}

function LetterModel({ onClick }) {
  const { scene } = useGLTF(LETTER_MODEL_PATH)

  const clone = useMemo(() => {
    const cloned = scene.clone(true)
    cloned.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
    return cloned
  }, [scene])

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0.18)
    shape.bezierCurveTo(0, 0.3, -0.18, 0.4, -0.3, 0.24)
    shape.bezierCurveTo(-0.42, 0.08, -0.3, -0.1, 0, -0.34)
    shape.bezierCurveTo(0.3, -0.1, 0.42, 0.08, 0.3, 0.24)
    shape.bezierCurveTo(0.18, 0.4, 0, 0.3, 0, 0.18)
    return shape
  }, [])

  const heartRef = useRef(null)
  const ringRef = useRef(null)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const bob = Math.sin(t * 2.2) * 0.035
    const pulse = 1 + Math.sin(t * 3.2) * 0.08

    if (heartRef.current) {
      heartRef.current.position.y = LETTER_INDICATOR_OFFSET_Y + bob
      heartRef.current.scale.setScalar(LETTER_INDICATOR_SCALE * pulse)
    }

    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(t * 3.2) * 0.06)
      ringRef.current.material.opacity = 0.35 + (Math.sin(t * 3.2) + 1) * 0.12
    }
  })

  const handleMarkerClick = (e) => {
    e.stopPropagation()
    onClick?.()
  }

  return (
    <group position={LETTER_POSITION}>
      <group
        rotation={LETTER_ROTATION}
        scale={LETTER_SCALE}>
        <primitive
          object={clone}
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        />
      </group>
      <mesh
        ref={heartRef}
        castShadow
        receiveShadow
        rotation={[0, 0, 0]}
        onClick={handleMarkerClick}>
        <extrudeGeometry
          args={[
            heartShape,
            {
              depth: 0.08,
              bevelEnabled: true,
              bevelSegments: 2,
              steps: 1,
              bevelSize: 0.02,
              bevelThickness: 0.02,
            },
          ]}
        />
        <meshStandardMaterial color='#fb7185' emissive='#be123c' emissiveIntensity={0.55} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh ref={ringRef} position={[0, LETTER_INDICATOR_OFFSET_Y - 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={handleMarkerClick}>
        <ringGeometry args={[0.16, 0.23, 48]} />
        <meshBasicMaterial color='#f43f5e' transparent opacity={0.45} />
      </mesh>
      <mesh position={[0, LETTER_INDICATOR_OFFSET_Y, 0]} onClick={handleMarkerClick}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html transform={false} center position={[0, LETTER_INDICATOR_OFFSET_Y + 0.16, 0]} style={{ pointerEvents: 'auto' }}>
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          className='rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-800 shadow-lg ring-1 ring-black/10 transition hover:scale-105'>
          Open
        </button>
      </Html>
    </group>
  )
}

export function RoomScene({ onLetterClick }) {
  const cameraRef = useRef(null)
  const lookAtTarget = useMemo(() => new THREE.Vector3(...CAMERA_LOOK_AT), [])
  const targetPosition = useMemo(() => new THREE.Vector3(...CAMERA_TARGET_POSITION), [])
  const isCameraSettled = useRef(false)

  useFrame((state, delta) => {
    if (!cameraRef.current) return
    if (isCameraSettled.current) {
      cameraRef.current.lookAt(lookAtTarget)
      return
    }

    const current = cameraRef.current.position
    const distance = current.distanceTo(targetPosition)

    if (distance <= CAMERA_STOP_EPSILON) {
      current.copy(targetPosition)
      isCameraSettled.current = true
      cameraRef.current.lookAt(lookAtTarget)
      return
    }

    const alpha = 1 - Math.exp(-CAMERA_MOVE_SPEED * delta)
    current.lerp(targetPosition, alpha)
    cameraRef.current.lookAt(lookAtTarget)
  })

  return (
    <>
      <color attach='background' args={['#d9e1ea']} />
      <ambientLight intensity={1.4} />
      <hemisphereLight args={['#ffffff', '#9eb3c7', 1.1]} />
      <directionalLight position={[8, 12, 6]} intensity={2.2} castShadow />
      <directionalLight position={[-8, 8, -6]} intensity={1.2} />
      <pointLight position={[-5, 4, -4]} intensity={1.4} />
      <pointLight position={[5, 3, 5]} intensity={1.1} />

      <PerspectiveCamera makeDefault ref={cameraRef} fov={45} position={CAMERA_BASE_POSITION} />

      <RoomModel />
      <LetterModel onClick={onLetterClick} />
    </>
  )
}

useGLTF.preload(ROOM_MODEL_PATH)
useGLTF.preload(LETTER_MODEL_PATH)
