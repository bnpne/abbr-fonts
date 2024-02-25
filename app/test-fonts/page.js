import FontdueHTML from 'components/FontdueHTML'
import {fetchGraphql} from 'libs/graphql'
import TestFontsForm from 'fontdue-js/TestFontsForm'

export const metadata = {
  title: 'Test fonts',
}

export default async function CustomerLoginPage() {
  const data = await fetchGraphql('Page.graphql', {slug: 'test-fonts'})

  const page = data.viewer.slug?.page

  return (
    <main className="page">
      <div className="page__body">
        <article className="markdown">
          {page?.text ? <FontdueHTML html={page.text} /> : null}
        </article>

        <TestFontsForm />
      </div>
    </main>
  )
}
