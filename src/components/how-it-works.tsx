import { LogIn, Link2, BarChart, RefreshCw } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: LogIn,
      title: 'CONNECT',
      description: 'Authorize with your Google account to access Search Console data.',
      color: 'cyan',
    },
    {
      icon: Link2,
      title: 'SELECT',
      description: 'Choose your website property from your Search Console.',
      color: 'purple',
    },
    {
      icon: BarChart,
      title: 'COMPETE',
      description: 'Enter the arena and see how you rank against global competitors.',
      color: 'green',
    },
    {
      icon: RefreshCw,
      title: 'TRACK',
      description: 'Automatic daily updates keep your position current in real-time.',
      color: 'amber',
    },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cyan':
        return 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400'
      case 'purple':
        return 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400'
      case 'green':
        return 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-400'
      case 'amber':
        return 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400'
      default:
        return 'from-slate-700/20 to-slate-700/5 border-slate-700/30 text-slate-400'
    }
  }

  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-cyan-400 uppercase tracking-wider">System Protocol</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl font-black text-white">
            HOW TO <span className="gradient-text">COMPETE</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Four simple steps to join the global rankings
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            const colorClasses = getColorClasses(step.color)

            return (
              <div
                key={index}
                className="group relative animate-count-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Step number indicator */}
                <div className="absolute -top-4 -left-4 z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses} border backdrop-blur-sm flex items-center justify-center font-black text-xl font-mono shadow-lg`}>
                    {index + 1}
                  </div>
                </div>

                {/* Card */}
                <div className={`relative h-full bg-gradient-to-br ${colorClasses} border backdrop-blur-sm rounded-2xl p-6 pt-8 transition-all duration-300 group-hover:scale-105`}>
                  {/* Icon */}
                  <div className="mb-4">
                    <Icon className="h-12 w-12" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-black mb-3 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Scan line effect */}
                  <div className="absolute inset-0 scan-lines rounded-2xl opacity-30" />
                </div>

                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-slate-700 to-transparent" />
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-mono text-sm text-slate-400">
              Ready in <span className="text-cyan-400 font-bold">{'<'} 60 seconds</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
