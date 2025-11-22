'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cleanDomain } from '@/lib/utils/domain'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Globe, CheckCircle, AlertCircle } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface AddWebsiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

interface GSCSite {
  siteUrl: string
  permissionLevel: string
}

export function AddWebsiteDialog({ open, onOpenChange, user }: AddWebsiteDialogProps) {
  const [sites, setSites] = useState<GSCSite[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (open && user) {
      fetchSites()
    }
  }, [open, user])

  const fetchSites = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/gsc/sites')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch sites')
      }

      setSites(data.sites || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSite = async (siteUrl: string) => {
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add website')
      }

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        // Refresh the page to show updated leaderboard
        window.location.reload()
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'https://www.googleapis.com/auth/webmasters.readonly',
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-black text-white">
            ADD YOUR <span className="gradient-text">WEBSITE</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {!user
              ? 'Sign in with Google to connect your Search Console account'
              : 'Select a website from your Google Search Console to add to the leaderboard'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!user ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <Globe className="h-16 w-16 mx-auto text-cyan-400 mb-4" />
                <p className="text-sm text-slate-400">
                  You need to authorize with Google to access your Search Console data
                </p>
              </div>
              <Button
                onClick={handleSignIn}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold glow-cyan"
              >
                Sign In with Google
              </Button>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
              <p className="text-sm text-slate-400 font-mono">Loading your websites...</p>
            </div>
          ) : success ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <p className="text-lg font-bold text-white mb-2">Success!</p>
              <p className="text-sm text-slate-400">Your website has been added to the leaderboard</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-400 mb-1">Error</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <p className="text-sm text-slate-400 mb-2">No websites found</p>
              <p className="text-xs text-slate-500">
                Make sure you have websites added to Google Search Console
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {sites.map((site) => (
                <div
                  key={site.siteUrl}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                        <p className="font-mono text-sm text-white truncate">{cleanDomain(site.siteUrl)}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs border-cyan-500/30 text-cyan-400"
                      >
                        {site.permissionLevel}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleAddSite(site.siteUrl)}
                      disabled={submitting}
                      size="sm"
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold ml-4"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Add'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
