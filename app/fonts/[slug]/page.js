import React from 'react'
import { fetchGraphql } from 'libs/graphql'
import { notEmpty } from 'libs/graphql/utils'
import FontDetail from 'components/FontDetail'
import { notFound } from 'next/navigation'

async function getData(params) {
  return fetchGraphql('Font.graphql', {
    slug: params.slug,
  })
}

export async function generateMetadata({ params }) {
  const { viewer } = await getData(await params)
  const font = viewer.slug?.fontCollection
  if (!font) return {}

  return {
    ...font.pageMetadata,
    title: font.pageMetadata?.title ?? font.name,
  }
}

export default async function Font({ params }) {
  const data = await getData(await params)
  const collection = data.viewer.slug?.fontCollection
  if (!collection) notFound()

  return <FontDetail collection={collection} />
}

export async function generateStaticParams() {
  const data = await fetchGraphql('FontPaths.graphql')
  const slugs =
    data.viewer.fontCollections?.edges
      ?.map((edge) => edge?.node?.slug?.name)
      .filter(notEmpty) ?? []

  return slugs.map((slug) => ({ slug }))
}
