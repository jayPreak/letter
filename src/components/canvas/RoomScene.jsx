'use client'

import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Change this to your room file in /public (example: '/my-room.glb')
const ROOM_MODEL_PATH = '/room.glb'

// Camera tuning values you can edit
const CAMERA_BASE_POSITION = [0, 1.6, 7]
const CAMERA_PAN_AMPLITUDE = [1.8, 0.25, 1.4]
const CAMERA_PAN_SPEED = 0.25
const CAMERA_LOOK_AT = [0, 1, 0]

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

export function RoomScene() {
  const cameraRef = useRef(null)
  const lookAtTarget = useMemo(() => new THREE.Vector3(...CAMERA_LOOK_AT), [])

  useFrame((state) => {
    if (!cameraRef.current) return

    const t = state.clock.getElapsedTime() * CAMERA_PAN_SPEED

    cameraRef.current.position.set(
      CAMERA_BASE_POSITION[0] + Math.sin(t) * CAMERA_PAN_AMPLITUDE[0],
      CAMERA_BASE_POSITION[1] + Math.sin(t * 0.7) * CAMERA_PAN_AMPLITUDE[1],
      CAMERA_BASE_POSITION[2] + Math.cos(t) * CAMERA_PAN_AMPLITUDE[2]
    )
    cameraRef.current.lookAt(lookAtTarget)
  })

  return (
    <>
      <color attach='background' args={['#111216']} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[8, 12, 6]} intensity={1.2} castShadow />
      <pointLight position={[-5, 4, -4]} intensity={0.6} />

      <PerspectiveCamera makeDefault ref={cameraRef} fov={45} position={CAMERA_BASE_POSITION} />

      <RoomModel />
    </>
  )
}

useGLTF.preload(ROOM_MODEL_PATH)
