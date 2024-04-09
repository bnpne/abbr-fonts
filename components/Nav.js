'use client'

import ActiveLink from './ActiveLink'
import CartButton from 'fontdue-js/CartButton'
import {usePathname} from 'next/navigation'
import {useEffect, useRef, useState} from 'react'
import gsap from 'gsap'
import {useLenis} from '@studio-freight/react-lenis'
import {useStore} from 'libs/store'
import {useMediaQuery} from '@studio-freight/hamo'
import {slide as Menu} from 'react-burger-menu'

export default function Nav({pages}) {
  const path = usePathname()
  const nav = useRef()
  const lenis = useLenis()
  const n = useStore()
  const isMobile = useMediaQuery('(max-width: 800px)')
  const [handleOpen, setHandleOpen] = useState(false)

  const showMenu = () => {
    handleOpen ? setHandleOpen(false) : setHandleOpen(true)
  }

  const handleOnClose = () => {
    setHandleOpen(false)
  }
  // useGSAP(
  //   () => {
  //     if (path === '/' || path === '/bespoke') {
  //       gsap.to('.nav-text', {
  //         height: 0,
  //         duration: 0.6,
  //         ease: 'expo.out',
  //         yoyoEase: true,
  //         scrollTrigger: {
  //           trigger: '.home',
  //           start: 'top top+=200px',
  //           toggleActions: 'play none reverse reverse',
  //         },
  //       })
  //     }
  //   },
  //   {dependencies: [path, isMobile, '.home']},
  // )

  useEffect(() => {
    if (lenis) {
      n.isNavOpened === true ? lenis.stop() : lenis.start()
      let t = gsap.to('.nav-text', {
        height: 0,
        duration: 0.6,
        ease: 'expo.out',
        yoyoEase: true,
        paused: true,
        reversed: true,
      })
      lenis.on('scroll', e => {
        if (e.direction === 1) {
          if (e.progress > 0) {
            t.play()
          } else {
            t.reverse()
          }
        } else if (e.direction === -1) {
          if (e.progress > 0.1) {
            t.play()
          } else {
            t.reverse()
          }
        }
      })
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
        {!isMobile ? (
          <>
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
            <ActiveLink className="nav-link" href="/test-fonts">
              Trials
            </ActiveLink>
            <ActiveLink className="nav-link" href="/customer-login">
              Log in
            </ActiveLink>
            <div className="nav-link" onClick={() => n.setIsNavOpened(true)}>
              <CartButton label="Cart" buttonStyle="inline" />
            </div>
          </>
        ) : (
          <>
            <div className="nav-link" onClick={showMenu}>
              Menu
            </div>
            <ActiveLink className="nav-link" href="/customer-login">
              Log in
            </ActiveLink>
            <div className="nav-link" onClick={() => n.setIsNavOpened(true)}>
              <CartButton label="Cart" buttonStyle="inline" />
            </div>
          </>
        )}
      </div>
      {isMobile && (
        <Menu
          noTransition
          itemListElement="span"
          customCrossIcon={false}
          customBurgerIcon={false}
          isOpen={handleOpen}
          noOverlay
          onClose={handleOnClose}
        >
          <ActiveLink onClick={showMenu} href="/">
            Typefaces
          </ActiveLink>
          <ActiveLink onClick={showMenu} href="/bespoke">
            Bespoke
          </ActiveLink>
          {pages?.map(node => (
            <ActiveLink
              onClick={showMenu}
              href={`/${node.slug?.name}`}
              key={node.id}
            >
              {node.title}
            </ActiveLink>
          ))}
          <ActiveLink onClick={showMenu} href="/test-fonts">
            Trials
          </ActiveLink>
        </Menu>
      )}
    </nav>
  )
}
