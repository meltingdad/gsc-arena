import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { google } from 'googleapis'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('GSC Sites - User ID:', user.id)

    // Get user's Google tokens from database
    const { data: tokenData, error: tokenError } = await supabase
      .from('user_tokens')
      .select('google_access_token, google_refresh_token')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('GSC Sites - Token query error:', tokenError)
    console.log('GSC Sites - Token data exists:', !!tokenData)
    console.log('GSC Sites - Has access token:', !!tokenData?.google_access_token)
    console.log('GSC Sites - Has refresh token:', !!tokenData?.google_refresh_token)

    if (tokenError) {
      console.error('Token query error:', tokenError)
      return NextResponse.json(
        { error: 'Database error fetching tokens', details: tokenError.message },
        { status: 500 }
      )
    }

    if (!tokenData || !tokenData.google_access_token) {
      console.warn('No tokens found for user:', user.id)
      return NextResponse.json(
        {
          error: 'No Google access token found. Please sign out and sign in again with Google to grant Search Console access.',
          userHasTokens: !!tokenData,
          hasAccessToken: !!tokenData?.google_access_token
        },
        { status: 400 }
      )
    }

    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )

    oauth2Client.setCredentials({
      access_token: tokenData.google_access_token,
      refresh_token: tokenData.google_refresh_token,
    })

    console.log('GSC Sites - Attempting to fetch sites from Google Search Console')

    // Get Search Console service
    const searchconsole = google.webmasters({ version: 'v3', auth: oauth2Client })

    // Fetch user's sites
    const response = await searchconsole.sites.list()

    console.log('GSC Sites - Successfully fetched sites:', response.data.siteEntry?.length || 0)

    return NextResponse.json({ sites: response.data.siteEntry || [] })
  } catch (error: any) {
    console.error('Error fetching GSC sites:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      {
        error: 'Failed to fetch sites',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
