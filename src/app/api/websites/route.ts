import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'

// Get all websites for leaderboard
export async function GET() {
  try {
    const websites = await prisma.website.findMany({
      include: {
        metrics: {
          orderBy: { lastUpdated: 'desc' },
          take: 1,
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Format data for leaderboard
    const leaderboardData = websites
      .map((website) => {
        const latestMetric = website.metrics[0]
        if (!latestMetric) return null

        return {
          id: website.id,
          domain: website.domain,
          clicks: latestMetric.totalClicks,
          impressions: latestMetric.totalImpressions,
          ctr: latestMetric.averageCtr,
          position: latestMetric.averagePosition,
          lastUpdated: latestMetric.lastUpdated,
        }
      })
      .filter(Boolean)
      .sort((a, b) => (b?.clicks || 0) - (a?.clicks || 0))
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }))

    return NextResponse.json({ data: leaderboardData })
  } catch (error: any) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', details: error.message },
      { status: 500 }
    )
  }
}

// Add a new website to the leaderboard
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { siteUrl } = await request.json()

    if (!siteUrl) {
      return NextResponse.json({ error: 'Site URL is required' }, { status: 400 })
    }

    // Get user's Google tokens
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
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

    // Extract domain from siteUrl
    const domain = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

    // Check if website already exists
    const existingWebsite = await prisma.website.findUnique({
      where: { domain },
    })

    if (existingWebsite) {
      return NextResponse.json(
        { error: 'This website is already in the leaderboard' },
        { status: 409 }
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

    // Calculate date range (last 28 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 28)

    const formatDate = (date: Date) => date.toISOString().split('T')[0]

    // Fetch metrics from Google Search Console
    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: [],
      },
    })

    const rows = response.data.rows || []
    const totalClicks = rows.reduce((sum, row) => sum + (row.clicks || 0), 0)
    const totalImpressions = rows.reduce((sum, row) => sum + (row.impressions || 0), 0)
    const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const averagePosition =
      rows.length > 0
        ? rows.reduce((sum, row) => sum + (row.position || 0), 0) / rows.length
        : 0

    // Create website and metrics in database
    const website = await prisma.website.create({
      data: {
        userId: user.id,
        domain,
        siteUrl,
        metrics: {
          create: {
            totalClicks,
            totalImpressions,
            averageCtr,
            averagePosition,
            dateRange: 'last_28_days',
            lastUpdated: new Date(),
          },
        },
      },
      include: {
        metrics: true,
      },
    })

    return NextResponse.json({
      success: true,
      website,
      message: 'Website added to leaderboard successfully!',
    })
  } catch (error: any) {
    console.error('Error adding website:', error)
    return NextResponse.json(
      { error: 'Failed to add website', details: error.message },
      { status: 500 }
    )
  }
}
