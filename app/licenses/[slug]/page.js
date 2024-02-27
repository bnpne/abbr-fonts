import React from 'react'
import {fetchGraphql} from '/libs/graphql'
import {notEmpty} from 'libs/graphql/utils'
import {notFound} from 'next/navigation'
import FontdueHTML from '/components/FontdueHTML'

async function getData({params}) {
  return fetchGraphql('License.graphql', {
    slug: params.slug,
  })
}

export async function generateMetadata(props) {
  const data = await getData(props)
  const license = data.viewer.slug?.license
  if (!license) return {}
  return {
    title: `${license.name} license`,
  }
}

export default async function Font(props) {
  const data = await getData(props)

  const license = data.viewer.slug?.license
  if (!license) notFound()

  return (
    <article className="markdown">
      <FontdueHTML html={license.text} />
    </article>
  )
}

export async function generateStaticParams() {
  const data = await fetchGraphql('LicensePaths.graphql')
  const slugs =
    data.viewer.licenses?.map(license => license.slug?.name).filter(notEmpty) ??
    []

  return slugs.map(slug => ({slug}))
}
