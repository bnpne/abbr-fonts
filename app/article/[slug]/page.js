import Carousel from 'components/Carousel'
import {fetchGraphql} from 'libs/graphql'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {Fragment} from 'react'
import FontdueHTML from 'components/FontdueHTML'
import {notEmpty} from 'libs/graphql/utils'

async function getData({params}) {
  return fetchGraphql('Article.graphql', {
    params,
  })
}

export async function generateMetadata(props) {
  const data = await getData(props)
  const article = data.viewer.slug?.article
  if (!article) return {}

  return {
    ...article.pageMetadata,
    title: article.pageMetadata?.title ?? article.title,
  }
}

export default async function Article(props) {
  const data = await getData(props)
  const article = data.viewer.slug?.article
  if (!article) notFound()

  return (
    <div className="article">
      <div>
        <Link href="/articles">Articles</Link>
      </div>

      <div className="article__header">
        <h1>{article.title}</h1>

        {article.tags ? (
          <div className="article__tags">
            {article.tags.map((tag, i) => (
              <Fragment key={i}>
                <Link href={`/articles?tag=${tag}`}>{tag}</Link>{' '}
              </Fragment>
            ))}
          </div>
        ) : null}

        {article.images?.length ? (
          <Carousel>
            {article.images.map((image, i) => (
              <Image
                key={image.id}
                src={image.url}
                className="article__image"
                width={image.meta?.width ?? 1200}
                height={image.meta?.height ?? 768}
                alt={image.description ?? ''}
                priority={i === 0}
              />
            ))}
          </Carousel>
        ) : null}
      </div>

      <div className="article__body markdown">
        <FontdueHTML html={article.body} />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const data = await fetchGraphql('ArticlePaths.graphql')
  const slugs =
    data.viewer.articles?.edges
      ?.map(edge => edge?.node?.slug?.name)
      .filter(notEmpty) ?? []

  return slugs.map(slug => ({slug}))
}
