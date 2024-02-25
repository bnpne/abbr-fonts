import {RealViewport} from 'components/real-viewport'
import {DeviceDetectionProvider} from 'context/device-detection.context'

import FontdueProvider from 'fontdue-js/FontdueProvider'
import StoreModal from 'fontdue-js/StoreModal'
import CartButton from 'fontdue-js/CartButton'
import parse from 'html-react-parser'
import 'fontdue-js/fontdue.css'
import Image from 'next/image'
import 'styles/main.scss'
import {fetchGraphql} from 'libs/graphql'
import ActiveLink from 'components/ActiveLink'
import PreloadWebfonts from 'components/PreloadWebfonts'
import FontdueHTML from 'components/FontdueHTML'

import {Layout} from 'layouts/default'

function styleFamilyName(style) {
  if (!style) return null
  return `"${style.cssFamily} ${style.name}"`
}

async function getData() {
  return fetchGraphql('RootLayout.graphql')
}

export async function generateMetadata() {
  const {viewer} = await getData()

  return {
    title: {
      template: `%s | ${viewer.settings?.title}`,
      default: viewer.settings?.title ?? '',
    },
  }
}

export default async function RootLayout({children}) {
  const {viewer} = await getData()

  const pages = viewer.pages?.edges?.map(edge => edge.node)

  const moreThanOneCollection = (viewer.fontCollections?.edges?.length ?? 0) > 1

  return (
    <html lang="en">
      <head>{parse(viewer.settings?.faviconMarkup ?? '')}</head>
      {/*<head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="referrer" content="no-referrer" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="US" />

        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      */}
      <body>
        {parse(viewer.settings?.htmlHead ?? '')}
        <PreloadWebfonts style={viewer.settings?.uiFontStyle} />
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: `body { font-family: ${styleFamilyName(
              viewer.settings?.uiFontStyle,
            )}, -apple-system,"Segoe UI",Roboto,"Helvetica Neue",sans-serif; }`,
          }}
        />

        <FontdueProvider
          config={{
            typeTester: {selectable: true, variableAxesPosition: 'auto'},
          }}
        >
          <nav className="nav" data-border="true">
            <div className="nav__links">
              <div className="nav__item" data-label="home">
                {viewer.logo ? (
                  <ActiveLink href="/" className="nav__link">
                    <Image
                      src={viewer.logo.url}
                      alt="Logo"
                      width={(viewer.logo.meta.width ?? 100) / 2}
                      height={(viewer.logo.meta.height ?? 100) / 2}
                      priority
                    />
                  </ActiveLink>
                ) : (
                  <h1>
                    <ActiveLink href="/" className="nav__link">
                      {viewer.settings?.title}
                    </ActiveLink>
                  </h1>
                )}
              </div>
              {moreThanOneCollection && (
                <ActiveLink className="nav__link" href="/">
                  Fonts
                </ActiveLink>
              )}
              {pages?.map(node => (
                <ActiveLink
                  href={`/${node.slug?.name}`}
                  className="nav__link"
                  key={node.id}
                >
                  {node.title}
                </ActiveLink>
              ))}
            </div>

            <div className="nav__item" data-label="login">
              <ActiveLink className="nav__link" href="/customer-login">
                Log in
              </ActiveLink>
            </div>
            <div className="nav__item" data-label="cart">
              <CartButton buttonStyle="icon" />
            </div>
          </nav>

          <Layout>
            <RealViewport />
            <DeviceDetectionProvider>
              <FontdueProvider>
                {children}
                <StoreModal />
              </FontdueProvider>
            </DeviceDetectionProvider>
          </Layout>

          <footer className="footer">
            <div className="footer__copyright">
              <FontdueHTML html={viewer.settings?.footerText} />
            </div>
          </footer>

          <StoreModal />
        </FontdueProvider>
      </body>
    </html>
  )
}
