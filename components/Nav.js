'use client'

import ActiveLink from './ActiveLink'
import CartButton from 'fontdue-js/CartButton'
import {usePathname} from 'next/navigation'
import {useEffect, useRef} from 'react'
import gsap from 'gsap'
import {useLenis} from '@studio-freight/react-lenis'
import {useStore} from 'libs/store'
import {useGSAP} from '@gsap/react'

export default function Nav({pages}) {
  const path = usePathname()
  const nav = useRef()
  const lenis = useLenis()
  const n = useStore()

  useGSAP(
    () => {
      path === '/' &&
        gsap.to('.nav-text', {
          height: 0,
          duration: 0.6,
          ease: 'expo.out',
          yoyoEase: true,
          scrollTrigger: {
            trigger: '.home',
            start: 'top top-=20px',
            toggleActions: 'play pause reverse reverse',
          },
        })
    },
    {scope: nav},
  )

  useEffect(() => {
    if (lenis) {
      n.isNavOpened === true ? lenis.stop() : lenis.start()
    }
  }, [n.isNavOpened, lenis])

  return (
    <nav ref={nav} className="nav" data-border="true">
      {(path === '/' || path === '/bespoke') && (
        <div className="nav-text">
          <div className="nav-text-title">ABBREVIATED FOUNDRY</div>
        </div>
      )}
      <div className="nav-links">
        <ActiveLink href="/" className="nav-link">
          Typefaces
        </ActiveLink>
        <ActiveLink href="/bespoke" className="nav-link">
          Bespoke
        </ActiveLink>
        {pages?.map(node => (
          <ActiveLink
            href={`/${node.slug?.name}`}
            className="nav-link"
            key={node.id}
          >
            {node.title}
          </ActiveLink>
        ))}
        <ActiveLink className="nav-link" href="/customer-login">
          Log in
        </ActiveLink>
        <div className="nav-link" onClick={() => n.setIsNavOpened(true)}>
          <CartButton label="Cart" buttonStyle="inline" />
        </div>
      </div>
    </nav>
  )
}
