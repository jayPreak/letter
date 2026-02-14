'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useState } from 'react'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => <div className='h-screen w-screen bg-[#111216]' />,
})

const RoomScene = dynamic(() => import('@/components/canvas/RoomScene').then((mod) => mod.RoomScene), {
  ssr: false,
})

export default function Page() {
  const [isLetterOpen, setIsLetterOpen] = useState(false)
  const [letterText, setLetterText] = useState('')

  return (
    <main className='relative h-screen w-screen overflow-hidden'>
      <View className='h-screen w-screen'>
        <Suspense fallback={null}>
          <RoomScene onLetterClick={() => setIsLetterOpen(true)} />
        </Suspense>
      </View>
      {isLetterOpen && (
        <div className='absolute inset-0 z-20 flex items-center justify-center bg-black/35 p-6' onClick={() => setIsLetterOpen(false)}>
          <div
            className='relative h-[78vh] w-full max-w-3xl overflow-hidden rounded-md shadow-2xl'
            style={{
              backgroundColor: '#f3e7cc',
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 38%), radial-gradient(circle at 80% 70%, rgba(120,72,32,0.08), transparent 42%), repeating-linear-gradient(0deg, rgba(120,72,32,0.07) 0px, rgba(120,72,32,0.07) 1px, transparent 1px, transparent 34px)',
              border: '1px solid rgba(120,72,32,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}>
            <button
              className='absolute right-3 top-3 z-10 rounded bg-black px-3 py-1 text-sm text-white'
              onClick={() => setIsLetterOpen(false)}>
              Close
            </button>
            <div className='flex h-full flex-col p-8 pt-14 sm:p-12 sm:pt-16'>
              <p className='mb-3 text-xs uppercase tracking-[0.25em] text-amber-900/70'>My Letter</p>
              <p className='mb-4 text-amber-900/80'>Dear Love,</p>
              <label htmlFor='letter-text' className='mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900/60'>
                Write Here
              </label>
              <textarea
                id='letter-text'
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                placeholder='Write your handwritten-style letter here...'
                className='h-full w-full resize-none bg-transparent p-0 text-[30px] leading-[1.25] text-amber-950 placeholder:text-amber-900/40 focus:outline-none'
                style={{
                  fontFamily: '"Snell Roundhand","Brush Script MT","Lucida Handwriting",cursive',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
