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

      console.log('Auth callback - User ID:', userId)
      console.log('Auth callback - Has provider token:', !!providerToken)
      console.log('Auth callback - Has refresh token:', !!providerRefreshToken)

      // Store Google OAuth tokens in user_tokens table if they exist
      if (providerToken && userId) {
        try {
          // Check if user_tokens record exists
          const { data: existingTokens, error: selectError } = await supabase
            .from('user_tokens')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle()

          if (selectError) {
            console.error('Error checking existing tokens:', selectError)
          }

          if (existingTokens) {
            // Update existing tokens
            const { error: updateError } = await supabase
              .from('user_tokens')
              .update({
                google_access_token: providerToken,
                google_refresh_token: providerRefreshToken,
                updated_at: new Date().toISOString(),
              })
              .eq('user_id', userId)

            if (updateError) {
              console.error('Error updating tokens:', updateError)
            } else {
              console.log('Tokens updated successfully')
            }
          } else {
            // Insert new tokens
            const { error: insertError } = await supabase
              .from('user_tokens')
              .insert({
                user_id: userId,
                google_access_token: providerToken,
                google_refresh_token: providerRefreshToken,
              })

            if (insertError) {
              console.error('Error inserting tokens:', insertError)
            } else {
              console.log('Tokens inserted successfully')
            }
          }
        } catch (err) {
          console.error('Exception storing tokens:', err)
        }
      } else {
        console.warn('Missing provider token or user ID - tokens not stored')
        console.log('Provider token exists:', !!providerToken)
        console.log('User ID exists:', !!userId)
      }

      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('Error exchanging code for session:', error)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
