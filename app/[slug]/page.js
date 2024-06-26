import fs from 'fs/promises'
import path from 'path'
import FontdueHTML from '/components/FontdueHTML'
import {fetchGraphql} from 'libs/graphql'
import {notEmpty} from 'libs/graphql/utils'
import {notFound} from 'next/navigation'

async function getPage({params}) {
  const {viewer} = await fetchGraphql('Page.graphql', {
    slug: params.slug,
  })
  return viewer.slug?.page
}

export async function generateMetadata(props) {
  const page = await getPage(props)
  if (!page) return {}
  return {
    ...page.pageMetadata,
    title: page.pageMetadata?.title ?? page.title,
  }
}

export default async function Page(props) {
  const page = await getPage(props)
  if (!page) notFound()

  return (
    <div className="page">
      <article className="markdown page-body">
        {page.text && <FontdueHTML html={page.text} />}
      </article>
    </div>
  )
}

export async function generateStaticParams() {
  // Solves an issue with Next.js when these [slug]/page.js clash with named
  // name/page.js routes
  const dirs = (
    await fs.readdir(path.resolve(__dirname, '..'), {withFileTypes: true})
  )
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name)

  const data = await fetchGraphql('PagePaths.graphql')
  const slugs =
    data.viewer.pages?.edges
      ?.map(edge => edge?.node?.slug?.name)
      .filter(notEmpty)
      .filter(slug => !dirs.includes(slug)) ?? []

  return slugs.map(slug => ({slug}))
}
