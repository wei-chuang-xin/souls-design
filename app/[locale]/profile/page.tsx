import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserFavorites, getUserDownloads } from '@/lib/user-actions'
import { getSoulBySlug } from '@/lib/souls'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { locale } = await params
  const { tab = 'favorites' } = await searchParams
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const [favorites, downloads] = await Promise.all([
    getUserFavorites(),
    getUserDownloads(),
  ])

  const favoriteSouls = favorites
    .map((slug) => ({ slug, soul: getSoulBySlug(slug) }))
    .filter((s) => s.soul !== null)

  const downloadSouls = downloads
    .map((d) => ({ ...d, soul: getSoulBySlug(d.soul_slug) }))
    .filter((d) => d.soul !== null)

  const joinedDate = new Date().toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <main className="min-h-screen bg-zinc-950 pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <img
            src={session.user.image ?? ''}
            alt={session.user.name ?? ''}
            className="w-16 h-16 rounded-full border-2 border-white/10"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{session.user.name}</h1>
            <p className="text-sm text-zinc-500">{session.user.email}</p>
            <p className="text-xs text-zinc-600 mt-0.5">Member since {joinedDate}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/10">
          {[
            { key: 'favorites', label: locale === 'zh' ? '我的收藏' : 'Favorites', count: favorites.length },
            { key: 'downloads', label: locale === 'zh' ? '下载记录' : 'Downloads', count: downloads.length },
            { key: 'settings', label: locale === 'zh' ? '设置' : 'Settings', count: null },
          ].map(({ key, label, count }) => (
            <Link
              key={key}
              href={`/${locale}/profile?tab=${key}`}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {label}
              {count !== null && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-400">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Favorites Tab */}
        {tab === 'favorites' && (
          <div>
            {favoriteSouls.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-lg mb-2">No favorites yet</p>
                <p className="text-zinc-600 text-sm mb-6">Browse souls and save the ones you like</p>
                <Link
                  href={`/${locale}/shop`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
                >
                  Browse Souls
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteSouls.map(({ slug, soul }) => (
                  <Link
                    key={slug}
                    href={`/${locale}/shop/${slug}`}
                    className="group p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <h3 className="font-semibold text-white group-hover:text-zinc-100 mb-1">
                      {soul!.name}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">{soul!.subtitle}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Downloads Tab */}
        {tab === 'downloads' && (
          <div>
            {downloadSouls.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-zinc-500 text-lg mb-2">No downloads yet</p>
                <p className="text-zinc-600 text-sm">Download a soul to see it here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {downloadSouls.map(({ soul_slug, soul, downloaded_at }) => (
                  <div
                    key={`${soul_slug}-${downloaded_at}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5"
                  >
                    <div>
                      <h3 className="font-medium text-white">{soul!.name}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {new Date(downloaded_at).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                      </p>
                    </div>
                    <Link
                      href={`/${locale}/shop/${soul_slug}`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-zinc-300 hover:text-white hover:border-white/40 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="max-w-md">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">
                  {locale === 'zh' ? '账户信息' : 'Account'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Name</label>
                    <p className="text-sm text-zinc-300 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      {session.user.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Email</label>
                    <p className="text-sm text-zinc-300 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-zinc-600">
                  {locale === 'zh'
                    ? '账户通过 Google 登录，在 Google 账户设置中管理你的信息。'
                    : 'Your account is managed via Google. Update your info in Google Account settings.'}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
