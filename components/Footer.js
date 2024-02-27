import Link from 'next/link'
import FontdueHTML from './FontdueHTML'

export default function Footer({viewer}) {
  return (
    <footer className="footer">
      <div className="footer-text">
        <h2>
          AbbrEVIATED Foundry is an ongoing STUDY in typography by AbbrEVIATED
          Projects. The FONTS on this site are Entirely designed BY AND SOLD
          EXCLUSIVELY ON AbbrEVIATED foundry.
        </h2>
      </div>
      <div className="footer-grid">
        <div className="footer-grid-col"></div>
        <div className="footer-grid-col"></div>
        <div className="footer-grid-col"></div>
        <div className="footer-grid-col"></div>
      </div>
      <div className="footer-pill">
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
    </footer>
  )
}
