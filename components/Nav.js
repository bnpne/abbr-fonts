'use client'

import ActiveLink from './ActiveLink'
import CartButton from 'fontdue-js/CartButton'
import gsap from 'gsap'
import {usePathname} from 'next/navigation'
import {useEffect} from 'react'

export default function Nav({pages}) {
  const path = usePathname()

  useEffect(() => {
    gsap.to('.nav-text', {
      height: 0,
      scrollTrigger: {
        trigger: '.nav',
        start: 'top top',
        end: 'center top',
        scrub: true,
      },
    })
  }, [])
  return (
    <nav className="nav" data-border="true">
      {path === '/' && (
        <div className="nav-text">
          <div className="nav-text-title">ABBREVIATED FOUNDRY</div>
        </div>
      )}
      <div className="nav-links">
        <ActiveLink href="/" className="nav-link">
          Typefaces
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
        <div className="nav-link">
          <CartButton label="Cart" buttonStyle="inline" />
        </div>
      </div>
    </nav>
  )
}
