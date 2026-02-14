'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { useEffect, useRef, useState } from 'react'

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
  const [showMusicButton, setShowMusicButton] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.45
    audio.play().catch(() => setShowMusicButton(true))
  }, [])

  const handleStartMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.play()
    setShowMusicButton(false)
  }

  return (
    <main className='relative h-screen w-screen overflow-hidden'>
      <audio ref={audioRef} src='/rotations.mp3' loop preload='auto' />
      {showMusicButton && (
        <button
          onClick={handleStartMusic}
          className='absolute left-4 top-4 z-30 rounded bg-black/80 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur'>
          Play music
        </button>
      )}
      <View className='h-screen w-screen'>
        <Suspense fallback={null}>
          <RoomScene onLetterClick={() => setIsLetterOpen(true)} />
        </Suspense>
      </View>
      {isLetterOpen && (
        <div className='absolute inset-0 z-20 flex items-center justify-center bg-black/35 p-6' onClick={() => setIsLetterOpen(false)}>
          <div
            className='relative h-[78vh] w-full max-w-3xl overflow-hidden rounded-sm shadow-2xl'
            style={{
              backgroundColor: '#efe2c2',
              backgroundImage:
                "url('/paper-texture.jpg'), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 35%), repeating-linear-gradient(0deg, rgba(98,57,19,0.04) 0px, rgba(98,57,19,0.04) 1px, transparent 1px, transparent 34px)",
              backgroundSize: 'cover, auto, auto',
              backgroundBlendMode: 'multiply, normal, normal',
              border: '1px solid rgba(95,52,16,0.22)',
              boxShadow: '0 24px 50px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.14)',
            }}
            onClick={(e) => e.stopPropagation()}>
            <div aria-hidden className='pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10' />
            <button
              className='absolute right-3 top-3 z-10 rounded bg-black px-3 py-1 text-sm text-white'
              onClick={() => setIsLetterOpen(false)}>
              Close
            </button>
            {/* <img
              src='/icons/share.png'
              alt='Left sticker placeholder'
              className='pointer-events-none absolute -bottom-8 -left-8 z-[6] h-28 w-28 rotate-[-12deg] object-cover drop-shadow-xl'
            /> */}
            <img
              src='/dog.png'
              alt='Right sticker placeholder'
              className='pointer-events-none absolute -bottom-6 -right-7 z-[6] h-48 w-48 rotate-[14deg] object-cover drop-shadow-xl'
            />
            <div className='flex h-full flex-col p-8 pt-14 sm:p-12 sm:pt-16'>
              {/* <p className='mb-3 text-xs uppercase tracking-[0.25em] text-amber-900/70'>My Letter</p> */}
              <p className='mb-4 text-amber-900/80'>To Ishita Shetye, My Love,</p>
              {/* <label htmlFor='letter-text' className='mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-900/60'>
                hiii
              </label> */}
              <textarea
                id='letter-text'
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                placeholder={`You are sleeping right now but I miss you so much so I thought maybe I could write something right now. I did not even plan to write anything before but after reading your letter, I just have to. It was so cute and amazing I literally started smiling and sobbing while reading it 😭
                  
Everyday since we started talking has been so much fun and I love every moment I spend with you. It all just felt so unreal and nice and amazing and ugh I love you so much. Meeting you was soooo much fun oh my god best 2 days of my life everything was just so amazing, seeing your pretty eyes and cute smile in front of me, hearing your beautiful voice, doing umm well hehe anywaysss I LOVE YOU SO MUCH MWAAAH

Also reassurance paragrph, I love you and YOU only so dont worry about anything I will always be with you and support you. You are the best and you work so hard, I believe in you and I want to be by your side seeing you and making you the happiest ever kissu
                  `}
                className='h-full w-full resize-none bg-transparent p-0 text-[24px] leading-[1.25] text-amber-950 placeholder:text-amber-900/40 focus:outline-none'
                style={{
                  fontFamily: '"Edu NSW ACT Cursive",cursive',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
