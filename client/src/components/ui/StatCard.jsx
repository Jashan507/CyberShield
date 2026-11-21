import React from 'react'

const StatCard = ({ title, value, icon: Icon, color = 'cyan', change }) => {
  const colorMap = {
    cyan: {
      icon: 'text-cyan-400',
      bg: 'bg-cyan-900/30',
      border: 'border-cyan-800/50',
      positive: 'text-green-400',
      negative: 'text-red-400'
    },
    red: {
      icon: 'text-red-400',
      bg: 'bg-red-900/30',
      border: 'border-red-800/50',
      positive: 'text-green-400',
      negative: 'text-red-400'
    },
    green: {
      icon: 'text-green-400',
      bg: 'bg-green-900/30',
      border: 'border-green-800/50',
      positive: 'text-green-400',
      negative: 'text-red-400'
    },
    yellow: {
      icon: 'text-yellow-400',
      bg: 'bg-yellow-900/30',
      border: 'border-yellow-800/50',
      positive: 'text-green-400',
      negative: 'text-red-400'
    },
    orange: {
      icon: 'text-orange-400',
      bg: 'bg-orange-900/30',
      border: 'border-orange-800/50',
      positive: 'text-green-400',
      negative: 'text-red-400'
    },
    purple: {
      icon: 'text-purple-400',
      bg: 'bg-purple-900/30',
      border: 'border-purple-800/50',
      positive: 'text-green-400',
      negative: 'text-red-400'
    }
  }

  const c = colorMap[color] || colorMap.cyan
  const isPositive = typeof change === 'number' ? change >= 0 : null

  return (
    <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5 hover:border-[#2d3f6b] transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
          {change !== undefined && change !== null && (
            <p className={`text-xs mt-1 ${isPositive ? c.positive : c.negative}`}>
              {isPositive ? '▲' : '▼'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
            <Icon size={22} className={c.icon} />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
