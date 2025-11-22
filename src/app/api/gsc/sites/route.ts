import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Google tokens
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        googleAccessToken: true,
        googleRefreshToken: true,
      },
    })

    if (!user?.googleAccessToken) {
      return NextResponse.json(
        { error: 'No Google access token found' },
        { status: 400 }
      )
    }

    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken,
    })

    // Get Search Console service
    const searchconsole = google.webmasters({ version: 'v3', auth: oauth2Client })

    // Fetch user's sites
    const response = await searchconsole.sites.list()

    return NextResponse.json({ sites: response.data.siteEntry || [] })
  } catch (error: any) {
    console.error('Error fetching GSC sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sites', details: error.message },
      { status: 500 }
    )
  }
}
