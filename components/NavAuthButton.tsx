import { auth, signOut } from '@/auth'
import Link from 'next/link'

export default async function NavAuthButton({ locale }: { locale: string }) {
  const session = await auth()

  if (session?.user) {
    return (
      <div className="relative group">
        {/* Avatar trigger */}
        <button className="flex items-center gap-2 focus:outline-none">
          <img
            src={session.user.image ?? ''}
            alt={session.user.name ?? 'User'}
            className="w-7 h-7 rounded-full border border-white/20 hover:border-white/50 transition-colors"
          />
        </button>

        {/* Dropdown */}
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-zinc-900 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{session.user.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href={`/${locale}/profile`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>👤</span> Profile
            </Link>
            <Link
              href={`/${locale}/profile?tab=settings`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>⚙️</span> Settings
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-white/10 py-1">
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: `/${locale}` })
              }}
            >
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-left"
              >
                <span>🚪</span> Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link
      href="/auth/signin"
      className="text-xs px-3 py-1.5 rounded-lg bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors"
    >
      Sign in
    </Link>
  )
}
