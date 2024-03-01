'use client'

import ActiveLink from './ActiveLink'
import CartButton from 'fontdue-js/CartButton'
import {usePathname} from 'next/navigation'
import {useEffect, useRef} from 'react'
import gsap from 'gsap'
import {useLenis} from '@studio-freight/react-lenis'
import {useStore} from 'libs/store'

export default function Nav({pages}) {
  const path = usePathname()
  const nav = useRef()
  const lenis = useLenis()
  const n = useStore()

  useEffect(() => {
    path === '/' &&
      gsap.to('.nav-text', {
        height: 0,
        scrollTrigger: {
          trigger: '.nav',
          start: 'top top',
          end: 'center top',
          scrub: true,
        },
      })
  }, [path])

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
