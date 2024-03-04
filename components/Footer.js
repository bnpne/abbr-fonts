'use client'

import Link from 'next/link'
import FontdueHTML from './FontdueHTML'
import {useRef} from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'

export default function Footer({viewer}) {
  const footer = useRef()
  const grid = useRef()
  const pill = useRef()
  const text = useRef()

  useGSAP(() => {
    const st = gsap.utils.toArray('[data-text-inner]', text.current)
    const ar = Array.prototype.slice.call(grid.current.children)
    gsap
      .timeline({
        scrollTrigger: {
          trigger: footer.current,
          start: 'top 90%',
        },
      })
      .fromTo(
        ar,
        {
          y: '100%',
        },
        {
          y: '0%',
          stagger: 0.1,
          ease: 'expo.out',
          duration: 1,
        },
      )
      .from(
        st,
        {
          y: '100%',
          stagger: 0.05,
          ease: 'expo.out',
          duration: 0.6,
        },
        '<40%',
      )
      .from(
        pill.current,
        {
          bottom: -50,
          ease: 'expo.out',
          duration: 0.5,
        },
        '<50%',
      )
  }, {})

  return (
    <footer ref={footer} className="footer">
      <div className="footer-container">
        <div className="footer-text">
          <h2 ref={text}>
            <span className="footer-text-outer">
              <span data-text-inner className="footer-text-inner">
                AbbrEVIATED Foundry is an ongoing
              </span>
            </span>
            <span className="footer-text-outer">
              <span data-text-inner className="footer-text-inner">
                STUDY in typography by AbbrEVIATED
              </span>
            </span>
            <span className="footer-text-outer">
              <span data-text-inner className="footer-text-inner">
                Projects. The FONTS on this site are
              </span>
            </span>
            <span className="footer-text-outer">
              <span data-text-inner className="footer-text-inner">
                Entirely designed BY AND SOLD
              </span>
            </span>
            <span className="footer-text-outer">
              <span data-text-inner className="footer-text-inner">
                EXCLUSIVELY ON AbbrEVIATED foundry.
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
              href="https://www.instagram.com/abbr.projects/"
            >
              Instagram
            </Link>
            <Link className="footer-link" href="mailto:simon@abranowicz.com">
              Contact
            </Link>
            <Link className="footer-link" href="https://www.abbrprojects.com/">
              ABBR. Projects
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
