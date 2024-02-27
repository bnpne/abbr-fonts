import {RealViewport} from 'components/real-viewport'
import {DeviceDetectionProvider} from 'context/device-detection.context'

import FontdueProvider from 'fontdue-js/FontdueProvider'
import StoreModal from 'fontdue-js/StoreModal'
import parse from 'html-react-parser'
import 'fontdue-js/fontdue.css'
import 'styles/main.scss'
import {fetchGraphql} from 'libs/graphql'
import PreloadWebfonts from 'components/PreloadWebfonts'
import {Layout} from 'layouts/default'
import Nav from 'components/Nav'
import Footer from 'components/Footer'

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
  // const moreThanOneCollection = (viewer.fontCollections?.edges?.length ?? 0) > 1

  // gsap.to('.title', {
  //   scrollTrigger: {
  //     trigger: '.title',
  //     start:
  //   }
  // })
  return (
    <html lang="en">
      <head>
        {parse(viewer.settings?.faviconMarkup ?? '')}
        <link
          href="https://fonts.fontdue.com/simon-abranowicz/css/Rm9udENvbGxlY3Rpb246MTY5MDM0MDA0MjE4NDU3MDg5OQ%3D%3D.css"
          rel="stylesheet"
        />
      </head>
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
          <Nav pages={pages} />
          <Layout>
            <RealViewport />
            <DeviceDetectionProvider>
              {children}
              <StoreModal />
            </DeviceDetectionProvider>
          </Layout>
          <Footer viewer={viewer} />
          <StoreModal />
        </FontdueProvider>
      </body>
    </html>
  )
}
