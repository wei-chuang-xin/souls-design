import { NextResponse } from 'next/server'
import { canCurrentUserDownload, getDownloadAccessState, recordDownload } from '@/lib/user-actions'
import { getSoulBySlug } from '@/lib/souls'
import JSZip from 'jszip'

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

  // 获取商品信息
  const soul = getSoulBySlug(slug)
  if (!soul) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  }

  // 创建 ZIP 文件
  const zip = new JSZip()
  
  // 添加 README
  if (soul.readme_content) {
    zip.file('README.md', soul.readme_content)
  }
  
  // 添加 SKILL.md（如果是 skill 类型）
  if (soul.item_type === 'skill' && soul.file_manifest?.includes('SKILL.md')) {
    const skillContent = `# ${soul.name}

${soul.subtitle || ''}

## Description

${soul.description}

## Installation

1. Download this skill
2. Extract to your OpenClaw skills directory
3. Restart OpenClaw

## Usage

[Add usage instructions here]

## License

${soul.license || 'MIT'}
`
    zip.file('SKILL.md', skillContent)
  }

  // 生成 ZIP arraybuffer
  const zipArrayBuffer = await zip.generateAsync({ type: 'arraybuffer' })

  // 返回文件流
  return new NextResponse(zipArrayBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}.zip"`,
    },
  })
}
