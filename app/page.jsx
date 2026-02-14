'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => <div className='h-screen w-screen bg-[#111216]' />,
})

const RoomScene = dynamic(() => import('@/components/canvas/RoomScene').then((mod) => mod.RoomScene), {
  ssr: false,
})

export default function Page() {
  return (
    <main className='h-screen w-screen overflow-hidden'>
      <View className='h-screen w-screen'>
        <Suspense fallback={null}>
          <RoomScene />
        </Suspense>
      </View>
    </main>
  )
}
