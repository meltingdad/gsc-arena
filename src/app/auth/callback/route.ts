import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Get the provider token (Google OAuth tokens)
      const providerToken = data.session.provider_token
      const providerRefreshToken = data.session.provider_refresh_token
      const userId = data.session.user.id

      // Store Google OAuth tokens in user_tokens table if they exist
      if (providerToken && userId) {
        // Check if user_tokens record exists
        const { data: existingTokens } = await supabase
          .from('user_tokens')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (existingTokens) {
          // Update existing tokens
          await supabase
            .from('user_tokens')
            .update({
              google_access_token: providerToken,
              google_refresh_token: providerRefreshToken,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
        } else {
          // Insert new tokens
          await supabase
            .from('user_tokens')
            .insert({
              user_id: userId,
              google_access_token: providerToken,
              google_refresh_token: providerRefreshToken,
            })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
