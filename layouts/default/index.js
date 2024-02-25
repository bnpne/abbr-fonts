'use client'

import {Lenis} from '@studio-freight/react-lenis'
import Tempus from '@studio-freight/tempus'
import cn from 'clsx'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger'

import 'styles/main.scss'
if (typeof window !== 'undefined') {
  gsap.defaults({ease: 'none'})
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.clearScrollMemory(window.history.scrollRestoration)
  ScrollTrigger.defaults({markers: true}) //process.env.NODE_ENV === 'development' })

  // merge rafs
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)
  Tempus?.add(time => {
    gsap.updateRoot(time / 1000)
  }, 0)

  // reset scroll position
  window.scrollTo(0, 0)
  window.history.scrollRestoration = 'manual'

  console.log('👋 Hello! 👀')
}

export function Layout({children, theme = 'light', className}) {
  return (
    <Lenis root>
      <div className={cn(`theme-${theme}`, className)}>
        <main>{children}</main>
      </div>
    </Lenis>
  )
}
