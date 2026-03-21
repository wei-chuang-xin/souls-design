import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { supabaseAdmin } from '@/lib/supabase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        // Upsert user into Supabase on every login
        await supabaseAdmin.from('users').upsert(
          {
            name: user.name ?? '',
            email: user.email,
            image: user.image ?? '',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email' }
        )
      }
      return true
    },
    async jwt({ token, user }) {
      if (user?.email) {
        // Fetch the Supabase user id (uuid) and store in token
        const { data } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()
        if (data) token.id = data.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})
