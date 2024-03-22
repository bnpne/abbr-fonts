'use client'

import Link from 'next/link'
import FontdueHTML from './FontdueHTML'
import {useRef} from 'react'

export default function Footer({viewer}) {
  const footer = useRef()
  const pill = useRef()

  return (
    <footer className="footer">
      <div ref={footer} className="footer-container">
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
              href="mailto:projects@abranowicz.com"
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
    </footer>
  )
}
