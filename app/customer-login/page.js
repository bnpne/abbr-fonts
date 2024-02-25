import FontdueHTML from 'components/FontdueHTML'
import {fetchGraphql} from 'libs/graphql'
import CustomerLoginForm from 'fontdue-js/CustomerLoginForm'

export const metadata = {
  title: 'Customer login',
}

export default async function CustomerLoginPage() {
  const data = await fetchGraphql('Page.graphql', {slug: 'customer-login'})

  const page = data.viewer.slug?.page

  return (
    <main className="page">
      <div className="page__body">
        <article className="markdown">
          {page?.text ? (
            <FontdueHTML html={page.text} />
          ) : (
            <p>
              Enter your email below and we’ll send you a link to login and view
              your order details.
            </p>
          )}
        </article>

        <CustomerLoginForm />
      </div>
    </main>
  )
}
