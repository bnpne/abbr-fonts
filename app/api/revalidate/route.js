import {revalidateTag} from 'next/cache'

export async function POST() {
  revalidateTag('graphql')
  return NextResponse.json({revalidated: true, now: Date.now()})
}
