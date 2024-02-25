import FontdueHTML from 'components/FontdueHTML'
import {fetchGraphql} from 'libs/graphql'

export const metadata = {
  title: 'Licenses',
}

export default async function LicensesPage() {
  const pageData = await fetchGraphql('Page.graphql', {slug: 'licenses'})

  const page = pageData.viewer.slug?.page

  return (
    <article className="markdown">
      {page?.text ? <FontdueHTML html={page.text} /> : null}
    </article>
  )
}
