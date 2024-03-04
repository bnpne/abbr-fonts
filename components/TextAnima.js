'use client'

import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {useRef} from 'react'

export default function TextAnima({children}) {
  const container = useRef()
  const text = useRef()

  useGSAP(
    () => {
      gsap.fromTo(
        text.current,
        {y: '100%', opacity: 0},
        {
          y: '0%',
          opacity: 1,
          ease: 'expo.out',
          duration: 0.6,
          scrollTrigger: {
            trigger: container.current,
            start: 'top 90%',
          },
        },
      )
    },
    {scope: container},
  )

  return (
    <span style={{overflow: 'hidden', display: 'block'}} ref={container}>
      <span style={{display: 'inline-block'}} ref={text}>
        {children}
      </span>
    </span>
  )
}
