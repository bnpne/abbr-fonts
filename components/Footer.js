'use client'

import Link from 'next/link'
import FontdueHTML from './FontdueHTML'
import {useRef} from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {usePathname} from 'next/navigation'

export default function Footer({viewer}) {
  const path = usePathname()
  const footer = useRef()
  const grid = useRef()
  const pill = useRef()
  const text = useRef()

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer.current,
          start: 'top bottom',
        },
      })
      if (path === '/' || path === '/info' || path === '/bespoke') {
        if (path !== '/info') {
          const st = gsap.utils.toArray('[data-text-inner]', text.current)
          const ar = Array.prototype.slice.call(grid.current.children)
          tl.from(ar, {
            y: '100%',
            stagger: 0.1,
            ease: 'expo.out',
            duration: 1,
          }).from(
            st,
            {
              y: '100%',
              opacity: 0,
              stagger: 0.05,
              ease: 'expo.out',
              duration: 0.6,
            },
            '<40%',
          )
        }
        tl.from(
          pill.current,
          {
            bottom: -50,
            ease: 'expo.out',
            duration: 0.5,
          },
          '<50%',
        )
      } else {
        const st = gsap.utils.toArray('[data-text-inner]', text.current)
        const ar = Array.prototype.slice.call(grid.current.children)

        gsap.set(ar, {
          y: '0%',
        })
        gsap.set(st, {
          y: '0%',
          opacity: 1,
        })
        gsap.set(pill.current, {
          bottom: 30,
        })
      }
    },
    {dependencies: [path], scope: footer},
  )

  return (
    <footer ref={footer} className="footer">
      {path !== '/info' && (
        <div className="footer-container">
          <div className="footer-text">
            <h2 ref={text}>
              <span className="footer-text-outer">
                <span data-text-inner className="footer-text-inner">
                  Abbreviated Foundry is an ongoing study in typography by
                </span>
              </span>
              <span className="footer-text-outer">
                <span data-text-inner className="footer-text-inner">
                  Abbreviated Projects. The fonts on this site are Entirely
                </span>
              </span>
              <span className="footer-text-outer">
                <span data-text-inner className="footer-text-inner">
                  designed by and sold exclusively on Abbr. Foundry.
                </span>
              </span>
            </h2>
          </div>
          <div ref={grid} className="footer-grid">
            <div className="footer-grid-col"></div>
            <div className="footer-grid-col"></div>
            <div className="footer-grid-col"></div>
            <div className="footer-grid-col"></div>
          </div>
          <div ref={pill} className="footer-pill">
            <div className="footer-links">
              <FontdueHTML
                className="footer-link"
                html={viewer.settings?.footerText}
              />
              <Link
                className="footer-link"
                target="_blank"
                href="https://www.instagram.com/abbr.projects/"
              >
                Instagram
              </Link>
              <Link
                className="footer-link"
                target="_blank"
                href="mailto:simon@abranowicz.com"
              >
                Contact
              </Link>
              <Link
                className="footer-link"
                target="_blank"
                href="https://www.abbrprojects.com/"
              >
                ABBR. Projects
              </Link>
            </div>
          </div>
        </div>
      )}
      {path === '/info' && (
        <div className="footer-info-container">
          <div ref={pill} className="footer-pill">
            <div className="footer-links">
              <FontdueHTML
                className="footer-link"
                html={viewer.settings?.footerText}
              />
              <Link
                className="footer-link"
                href="https://www.instagram.com/abbr.projects/"
              >
                Instagram
              </Link>
              <Link className="footer-link" href="mailto:simon@abranowicz.com">
                Contact
              </Link>
              <Link
                className="footer-link"
                href="https://www.abbrprojects.com/"
              >
                ABBR. Projects
              </Link>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
