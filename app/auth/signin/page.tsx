import { signIn } from '@/auth'

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2">Sign in</h1>
        <p className="text-zinc-400 text-sm mb-8">to download paid Souls</p>
        <form
          action={async () => {
            'use server'
            const params = await searchParams
            await signIn('google', { redirectTo: params.callbackUrl ?? '/' })
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white text-zinc-900 font-medium px-4 py-3 rounded-xl hover:bg-zinc-100 transition"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}
