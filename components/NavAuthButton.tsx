import { auth, signOut } from '@/auth'
import Link from 'next/link'

export default async function NavAuthButton({ locale }: { locale: string }) {
  const session = await auth()

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <img
          src={session.user.image ?? ''}
          alt={session.user.name ?? 'User'}
          className="w-7 h-7 rounded-full border border-white/20"
        />
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: `/${locale}` })
          }}
        >
          <button type="submit" className="text-xs text-zinc-400 hover:text-white transition-colors">
            Sign out
          </button>
        </form>
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
