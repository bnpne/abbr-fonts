import Link from 'next/link'
import {fetchGraphql} from '../../libs/graphql'
import FontStyle from '../../components/FontStyle'
import {notEmpty} from 'libs/graphql/utils'
import PreloadWebfonts from '../../components/PreloadWebfonts'
import FontDetail from '../../components/FontDetail'

export default async function Home() {
  const data = await fetchGraphql('Index.graphql')

  const collections = data.viewer.fontCollections?.edges
    ?.map(edge => edge?.node)
    .filter(notEmpty)

  if (collections?.length === 1) {
    const firstCollection = data.viewer.firstCollection?.edges?.[0]?.node
    if (firstCollection) return <FontDetail collection={firstCollection} />
  }

  return (
    <section className="home">
      {collections?.map(node => {
        if (!node.slug) return

        return (
          <h2 key={node.id} className="home-collection">
            <PreloadWebfonts style={node.featureStyle} />
            <FontStyle
              familyName={node.featureStyle?.cssFamily}
              styleName={node.featureStyle?.name}
              className="home-collection-name"
            >
              <Link
                href={`/fonts/${node.slug.name}`}
                className="home-collection-link"
                style={{
                  '--optical-adjustment': node.opticalAdjustment,
                }}
              >
                {node.name}
              </Link>
            </FontStyle>
            {node.isNew && (
              <span className="home-collection-new">&nbsp;New</span>
            )}
          </h2>
        )
      })}
    </section>
  )
}
