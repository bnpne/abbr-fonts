'use client'

import {Lenis} from '@studio-freight/react-lenis'
import Tempus from '@studio-freight/tempus'
import cn from 'clsx'
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger'
import {useTheme} from 'libs/store'
import Script from 'next/script'

if (typeof window !== 'undefined') {
  gsap.defaults({ease: 'none'})
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.clearScrollMemory(window.history.scrollRestoration)
  // ScrollTrigger.defaults({
  //   markers: process.env.NODE_ENV === 'development' ? true : false,
  // })

  // merge rafs
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)
  Tempus?.add(time => {
    gsap.updateRoot(time / 1000)
  }, 0)

  // reset scroll position
  window.scrollTo(0, 0)
  window.history.scrollRestoration = 'manual'
}

export function Layout({children, className}) {
  const t = useTheme()
  return (
    <Lenis root>
      <Script
        async
        type="text/javascript"
        src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=UFNDNs"
      />
      <div className={cn(`theme-${t.currentTheme}`, className)}>
        <main>{children}</main>
      </div>
    </Lenis>
  )
}
