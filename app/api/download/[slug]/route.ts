import { NextResponse } from 'next/server'
import { canCurrentUserDownload, getDownloadAccessState, recordDownload } from '@/lib/user-actions'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const accessState = await getDownloadAccessState(slug)
  const allowed = await canCurrentUserDownload(slug)

  if (!allowed) {
    const status = accessState === 'signin' ? 401 : 403
    return NextResponse.json(
      {
        ok: false,
        error: accessState === 'signin' ? 'signin_required' : 'purchase_required',
        accessState,
      },
      { status }
    )
  }

  await recordDownload(slug)

  return NextResponse.json({
    ok: true,
    accessState,
    downloadUrl: `/downloads/${slug}.zip`,
  })
}
