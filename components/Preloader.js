'use client'

import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {useRef} from 'react'

export default function Preloader() {
  const pre = useRef()
  useGSAP(() => {
    gsap.to(pre.current, {
      y: '-100%',
      duration: 0.6,
      delay: 0.4,
      ease: 'expo.inOut',
    })
  })
  return <div ref={pre} data-preloader className="preloader"></div>
}
