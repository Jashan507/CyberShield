import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

const COLORS = [
  '#00d4ff', '#00f5d4', '#6366f1', '#8b5cf6', '#f59e0b',
  '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#14b8a6'
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111c35] border border-[#1a2847] rounded-lg px-3 py-2 text-sm shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="text-cyan-400 font-medium">{payload[0].value} incidents</p>
      </div>
    )
  }
  return null
}

const CategoryBarChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        No data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a2847" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          angle={-35}
          textAnchor="end"
          interval={0}
          height={70}
        />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1a2847' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default CategoryBarChart
