import React, { useEffect, useState } from 'react'
import { BarChart2, AlertTriangle, Bug, Users, CheckCircle, Clock, Shield } from 'lucide-react'
import axiosInstance from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import StatCard from '../../components/ui/StatCard'
import Loader from '../../components/ui/Loader'
import SeverityPieChart from '../../components/charts/SeverityPieChart'
import CategoryBarChart from '../../components/charts/CategoryBarChart'
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = { Low: '#22c55e', Medium: '#eab308', High: '#f97316', Critical: '#ef4444' }

const Analytics = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        if (isAdmin) {
          const res = await axiosInstance.get('/admin/analytics')
          setData(res.data.data)
        } else {
          const [incRes, vulnRes] = await Promise.all([
            axiosInstance.get('/incidents?limit=1000'),
            axiosInstance.get('/vulnerabilities?limit=1000'),
          ])
          const incs = incRes.data.data || []
          const vulns = vulnRes.data.data || []
          const countBy = (arr, key) => {
            const map = {}
            arr.forEach(i => { map[i[key]] = (map[i[key]] || 0) + 1 })
            return Object.entries(map).map(([_id, count]) => ({ _id, count }))
          }
          setData({
            totalIncidents: incs.length,
            openIncidents: incs.filter(i => !['Resolved','Closed'].includes(i.status)).length,
            resolvedIncidents: incs.filter(i => ['Resolved','Closed'].includes(i.status)).length,
            criticalIncidents: incs.filter(i => i.severity === 'Critical').length,
            totalVulnerabilities: vulns.length,
            openVulnerabilities: vulns.filter(v => v.status === 'Open').length,
            incidentsBySeverity: countBy(incs, 'severity'),
            incidentsByCategory: countBy(incs, 'category'),
            incidentsByStatus: countBy(incs, 'status'),
            vulnerabilitiesBySeverity: countBy(vulns, 'severity'),
            monthlyIncidents: [],
          })
        }
      } catch { setError('Failed to load analytics.') }
      finally { setLoading(false) }
    }
    fetch()
  }, [isAdmin])

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>
  if (error) return <div className="bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg px-4 py-3">{error}</div>
  if (!data) return null

  const resolvedVsOpen = [
    { name: 'Open', value: data.openIncidents || 0 },
    { name: 'Resolved/Closed', value: data.resolvedIncidents || 0 },
  ]
  const statusData = (data.incidentsByStatus || []).map(d => ({ name: d._id, count: d.count }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><BarChart2 size={22} className="text-cyan-400" /> Security Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">{isAdmin ? 'Organization-wide security metrics' : 'Your personal security metrics'}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Incidents" value={data.totalIncidents || 0} icon={AlertTriangle} color="cyan" />
        <StatCard title="Open Incidents" value={data.openIncidents || 0} icon={Clock} color="yellow" />
        <StatCard title="Critical Alerts" value={data.criticalIncidents || 0} icon={Shield} color="red" />
        <StatCard title="Resolved" value={data.resolvedIncidents || 0} icon={CheckCircle} color="green" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Vulnerabilities" value={data.totalVulnerabilities || 0} icon={Bug} color="orange" />
        <StatCard title="Open Vulns" value={data.openVulnerabilities || 0} icon={Bug} color="red" />
        {isAdmin && <StatCard title="Total Users" value={data.totalUsers || 0} icon={Users} color="cyan" />}
        {isAdmin && <StatCard title="Active Users" value={data.activeUsers || 0} icon={Users} color="green" />}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Incidents by Severity</h2>
          <SeverityPieChart data={(data.incidentsBySeverity || []).map(d => ({ name: d._id, value: d.count }))} />
        </div>
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Incidents by Category</h2>
          <CategoryBarChart data={(data.incidentsByCategory || []).map(d => ({ name: d._id, count: d.count }))} />
        </div>
      </div>

      {/* Charts Row 2 */}
      {isAdmin && data.monthlyIncidents?.length > 0 && (
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Monthly Incident Trend</h2>
          <MonthlyTrendChart data={data.monthlyIncidents.map(d => ({ month: d.month, count: d.count }))} />
        </div>
      )}

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Vulnerabilities by Severity</h2>
          <SeverityPieChart data={(data.vulnerabilitiesBySeverity || []).map(d => ({ name: d._id, value: d.count }))} />
        </div>
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Resolved vs Open Incidents</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={resolvedVsOpen} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2847" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111c35', border: '1px solid #1a2847', borderRadius: '8px', color: '#e2e8f0' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {resolvedVsOpen.map((entry, i) => (
                  <Cell key={i} fill={i === 0 ? '#f97316' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incident Status Breakdown */}
      {statusData.length > 0 && (
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Incidents by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2847" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#111c35', border: '1px solid #1a2847', borderRadius: '8px', color: '#e2e8f0' }} />
              <Bar dataKey="count" fill="#00d4ff" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default Analytics
