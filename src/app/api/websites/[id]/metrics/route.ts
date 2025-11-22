import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: websiteId } = await params

    // Fetch daily metrics for the last 12 months
    const { data: dailyMetrics, error } = await supabase
      .from('daily_metrics')
      .select('date, clicks, impressions, ctr, position')
      .eq('website_id', websiteId)
      .order('date', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ data: dailyMetrics || [] })
  } catch (error: any) {
    console.error('Error fetching daily metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily metrics', details: error.message },
      { status: 500 }
    )
  }
}
