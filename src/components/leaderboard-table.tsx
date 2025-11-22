'use client'

import { useState } from 'react'
import { ArrowUpDown, TrendingUp, Eye, MousePointer, Target, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getDomainUrl } from '@/lib/utils/domain'

type SortField = 'clicks' | 'impressions' | 'ctr' | 'position'
type SortDirection = 'asc' | 'desc'

interface LeaderboardEntry {
  id: string
  rank: number
  domain: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  lastUpdated: Date
  anonymous: boolean
  faviconUrl: string | null
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[]
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const [sortField, setSortField] = useState<SortField>('clicks')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    }
    return aValue < bValue ? 1 : -1
  })

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="metallic-gold px-3 py-1.5 rounded-md font-black text-slate-900 text-base min-w-[50px] text-center">
          #1
        </div>
      )
    }
    if (rank === 2) {
      return (
        <div className="metallic-silver px-3 py-1.5 rounded-md font-black text-slate-900 text-base min-w-[50px] text-center">
          #2
        </div>
      )
    }
    if (rank === 3) {
      return (
        <div className="metallic-bronze px-3 py-1.5 rounded-md font-black text-slate-900 text-base min-w-[50px] text-center">
          #3
        </div>
      )
    }
    return (
      <div className="border border-slate-700 px-3 py-1.5 rounded-md font-bold text-slate-400 text-sm min-w-[50px] text-center font-mono">
        #{rank}
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toLocaleString()
  }

  const formatCTR = (ctr: number) => {
    return ctr.toFixed(2) + '%'
  }

  const formatPosition = (pos: number) => {
    return pos.toFixed(1)
  }

  const SortButton = ({ field, label, icon: Icon }: { field: SortField; label: string; icon?: any }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1.5 font-mono uppercase text-xs tracking-wide transition-colors hover:text-cyan-400 whitespace-nowrap ${
        sortField === field ? 'text-cyan-400' : 'text-slate-400'
      }`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
      <ArrowUpDown className="h-3 w-3 flex-shrink-0" />
    </button>
  )

  return (
    <div className="space-y-2.5">
      {/* Table Header */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2.5 backdrop-blur-sm">
        <div className="grid grid-cols-[60px_1fr_100px_110px_100px_90px_110px] gap-3 items-center">
          <div className="font-mono uppercase text-[10px] tracking-wider text-slate-400">Rank</div>
          <div className="font-mono uppercase text-[10px] tracking-wider text-slate-400">Domain</div>
          <div className="text-right">
            <SortButton field="clicks" label="Clicks" icon={MousePointer} />
          </div>
          <div className="text-right">
            <SortButton field="impressions" label="Views" icon={Eye} />
          </div>
          <div className="text-right">
            <SortButton field="ctr" label="CTR" icon={TrendingUp} />
          </div>
          <div className="text-right">
            <SortButton field="position" label="Pos" icon={Target} />
          </div>
          <div className="text-right font-mono uppercase text-[10px] tracking-wider text-slate-400 whitespace-nowrap">
            Last Update
          </div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {sortedData.length === 0 ? (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-10 text-center backdrop-blur-sm">
            <div className="text-slate-500 font-mono">
              <div className="text-5xl mb-3">🏆</div>
              <div className="text-base mb-1.5">NO COMPETITORS YET</div>
              <div className="text-xs text-slate-600">Be the first to enter the arena</div>
            </div>
          </div>
        ) : (
          sortedData.map((entry, index) => (
            <div
              key={entry.id}
              className="group bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/50 rounded-lg px-3 py-2.5 backdrop-blur-sm transition-all duration-200 hover:scale-[1.01] hover:glow-cyan animate-count-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="grid grid-cols-[60px_1fr_100px_110px_100px_90px_110px] gap-3 items-center">
                {/* Rank Badge */}
                <div className="flex justify-center">{getRankBadge(entry.rank)}</div>

                {/* Domain */}
                <div className="flex items-center gap-2 font-display font-bold text-white text-base min-w-0">
                  {entry.anonymous ? (
                    <>
                      <span className="blur-sm select-none text-sm">••••••••••••</span>
                      <span className="text-[10px] text-purple-400 font-mono">(ANON)</span>
                    </>
                  ) : (
                    <a
                      href={getDomainUrl(entry.domain)}
                      target="_blank"
                      rel="dofollow noopener"
                      className="flex items-center gap-1.5 truncate hover:text-cyan-400 transition-colors group/link cursor-pointer min-w-0"
                    >
                      {entry.faviconUrl && (
                        <img
                          src={entry.faviconUrl}
                          alt=""
                          className="w-4 h-4 flex-shrink-0"
                          onError={(e) => {
                            // Hide favicon if it fails to load
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <span className="truncate">{entry.domain}</span>
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>

                {/* Clicks */}
                <div className="text-right font-mono text-base font-bold text-cyan-400">
                  {formatNumber(entry.clicks)}
                </div>

                {/* Impressions */}
                <div className="text-right font-mono text-base font-bold text-purple-400">
                  {formatNumber(entry.impressions)}
                </div>

                {/* CTR */}
                <div className="text-right">
                  <div className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                    entry.ctr > 3
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {entry.ctr > 3 ? <TrendingUp className="h-2.5 w-2.5" /> : null}
                    {formatCTR(entry.ctr)}
                  </div>
                </div>

                {/* Position */}
                <div className="text-right font-mono text-base font-bold text-amber-400">
                  {formatPosition(entry.position)}
                </div>

                {/* Last Updated */}
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500 leading-tight">
                    {formatDistanceToNow(new Date(entry.lastUpdated), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
