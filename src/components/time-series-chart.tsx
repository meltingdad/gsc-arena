'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { TrendingUp, Eye, MousePointer, Target, Loader2 } from 'lucide-react'

interface DailyMetric {
  date: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface TimeSeriesChartProps {
  websiteId: string
}

export function TimeSeriesChart({ websiteId }: TimeSeriesChartProps) {
  const [data, setData] = useState<DailyMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [activeMetrics, setActiveMetrics] = useState({
    clicks: true,
    impressions: true,
    ctr: true,
    position: true,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/websites/${websiteId}/metrics`)
        if (response.ok) {
          const result = await response.json()
          setData(result.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch time-series data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [websiteId])

  const toggleMetric = (metric: keyof typeof activeMetrics) => {
    setActiveMetrics(prev => ({ ...prev, [metric]: !prev[metric] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-500 font-mono">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-sm">No historical data available</div>
        </div>
      </div>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 border border-slate-700 rounded-lg p-3 backdrop-blur-sm">
          <p className="font-mono text-xs text-slate-400 mb-2">
            {format(parseISO(label), 'MMM d, yyyy')}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-mono text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'CTR' ? `${entry.value.toFixed(2)}%` : entry.name === 'Position' ? entry.value.toFixed(1) : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const metrics = [
    { key: 'clicks', label: 'Clicks', color: '#22d3ee', icon: MousePointer },
    { key: 'impressions', label: 'Impressions', color: '#c084fc', icon: Eye },
    { key: 'ctr', label: 'CTR', color: '#4ade80', icon: TrendingUp },
    { key: 'position', label: 'Position', color: '#fbbf24', icon: Target },
  ]

  return (
    <div className="space-y-4">
      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2">
        {metrics.map(({ key, label, color, icon: Icon }) => (
          <button
            key={key}
            onClick={() => toggleMetric(key as keyof typeof activeMetrics)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
              activeMetrics[key as keyof typeof activeMetrics]
                ? 'border-2'
                : 'border border-slate-700 opacity-50 hover:opacity-100'
            }`}
            style={{
              borderColor: activeMetrics[key as keyof typeof activeMetrics] ? color : undefined,
              color: activeMetrics[key as keyof typeof activeMetrics] ? color : '#94a3b8',
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 backdrop-blur-sm">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), 'MMM d')}
              stroke="#94a3b8"
              style={{ fontSize: '11px', fontFamily: 'monospace' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              style={{ fontSize: '11px', fontFamily: 'monospace' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              style={{ fontSize: '11px', fontFamily: 'monospace' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
              iconType="line"
            />
            {activeMetrics.clicks && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="clicks"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
                name="Clicks"
              />
            )}
            {activeMetrics.impressions && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="impressions"
                stroke="#c084fc"
                strokeWidth={2}
                dot={false}
                name="Impressions"
              />
            )}
            {activeMetrics.ctr && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ctr"
                stroke="#4ade80"
                strokeWidth={2}
                dot={false}
                name="CTR"
              />
            )}
            {activeMetrics.position && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="position"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
                name="Position"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map(({ key, label, color, icon: Icon }) => {
          const values = data.map(d => d[key as keyof DailyMetric] as number)
          const avg = values.reduce((a, b) => a + b, 0) / values.length
          const max = Math.max(...values)
          const min = Math.min(...values)

          return (
            <div
              key={key}
              className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" style={{ color }} />
                <span className="font-mono text-xs text-slate-400 uppercase">{label}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono text-slate-500">Avg:</span>
                  <span className="font-mono text-sm font-bold" style={{ color }}>
                    {key === 'ctr' ? `${avg.toFixed(2)}%` : key === 'position' ? avg.toFixed(1) : Math.round(avg).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono text-slate-500">Max:</span>
                  <span className="font-mono text-xs text-slate-400">
                    {key === 'ctr' ? `${max.toFixed(2)}%` : key === 'position' ? max.toFixed(1) : max.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono text-slate-500">Min:</span>
                  <span className="font-mono text-xs text-slate-400">
                    {key === 'ctr' ? `${min.toFixed(2)}%` : key === 'position' ? min.toFixed(1) : min.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
