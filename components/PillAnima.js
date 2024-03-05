'use client'

import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {useRef} from 'react'

export default function PillAnima({children, className}) {
  const pill = useRef()

  useGSAP(() => {
    const trigger = pill.current.parentElement
    const el = pill.current.children[0]
    gsap.from(el, {
      scale: 0,
      duration: 0.6,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: trigger,
        start: 'top 95%',
      },
    })
  })
  return (
    <span className={className} ref={pill}>
      {children}
    </span>
  )
}
