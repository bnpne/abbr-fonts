import {RealViewport} from 'components/real-viewport'
import {DeviceDetectionProvider} from 'context/device-detection.context'
import FontdueProvider from 'fontdue-js/FontdueProvider'
import parse from 'html-react-parser'
import 'fontdue-js/fontdue.css'
import 'styles/main.scss'
import {fetchGraphql} from 'libs/graphql'
import PreloadWebfonts from 'components/PreloadWebfonts'
import Nav from 'components/Nav'
import Footer from 'components/Footer'
import {Layout} from 'layouts/default'
import {StoreModalContainer} from 'components/StoreModalContainer'

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
            storeModal: {indexExcludeTags: ['Bespoke']},
          }}
        >
          <Layout>
            <Nav pages={pages} />
            <RealViewport />
            <DeviceDetectionProvider>
              {children}
              <StoreModalContainer />
            </DeviceDetectionProvider>
            <Footer viewer={viewer} />
          </Layout>
        </FontdueProvider>
      </body>
    </html>
  )
}
