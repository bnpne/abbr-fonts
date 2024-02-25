import {revalidateTag} from 'next/cache'

export async function POST(_request) {
  revalidateTag('graphql')
  return NextResponse.json({revalidated: true, now: Date.now()})
}
