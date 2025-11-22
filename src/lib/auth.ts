import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request access to Google Search Console
          scope: 'openid email profile https://www.googleapis.com/auth/webmasters.readonly',
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        // Store the Google tokens for later use with Search Console API
        if (account.access_token && account.refresh_token) {
          await prisma.user.update({
            where: { email: profile?.email },
            data: {
              googleAccessToken: account.access_token,
              googleRefreshToken: account.refresh_token,
            },
          })
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
