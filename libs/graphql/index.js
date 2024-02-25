import {promises as fs} from 'fs'
import crypto from 'crypto'
import path from 'path'

const ENDPOINT = `${process.env.NEXT_PUBLIC_FONTDUE_URL}/graphql`

const getStaticQuery = async queryName => {
  let query = await fs.readFile(
    path.resolve(process.cwd(), 'libs', 'queries', queryName),
    'utf8',
  )

  return query
}

const fetchGraphql = async (queryName, variables) => {
  const hash = crypto
    .createHash('md5')
    .update(`${JSON.stringify(variables)}`)
    .digest('hex')
    .slice(0, 6)
  const query = await getStaticQuery(queryName)
  const response = await fetch(`${ENDPOINT}?query=${queryName}&hash=${hash}`, {
    method: 'POST',
    body: JSON.stringify({query, variables}),
    headers: {
      'content-type': 'application/json',
    },
    next: {
      tags: ['graphql'],
    },
  })

  if (response.status !== 200) {
    throw new Error('Fontdue request failed')
  }

  const json = await response.json()

  const errorMessage = json.errors?.[0]?.message
  if (errorMessage) {
    throw new Error(`Fontdue graphql request error: ${errorMessage}`)
  }

  return json.data
}

export {fetchGraphql, getStaticQuery}
