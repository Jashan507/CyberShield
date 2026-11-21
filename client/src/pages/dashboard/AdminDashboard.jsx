import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Bug, Users, CheckCircle, Clock, Shield, Activity, ArrowRight } from 'lucide-react'
import axiosInstance from '../../api/axios'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Loader from '../../components/ui/Loader'
import SeverityPieChart from '../../components/charts/SeverityPieChart'
import CategoryBarChart from '../../components/charts/CategoryBarChart'
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart'
import { formatDate, truncate } from '../../utils/helpers'

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axiosInstance.get('/admin/analytics')
      .then(res => setAnalytics(res.data.data))
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>
  if (error) return <div className="bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg px-4 py-3">{error}</div>

  const {
    totalIncidents = 0, openIncidents = 0, resolvedIncidents = 0, criticalIncidents = 0,
    totalVulnerabilities = 0, openVulnerabilities = 0, totalUsers = 0, activeUsers = 0,
    incidentsBySeverity = [], incidentsByCategory = [], monthlyIncidents = [],
    vulnerabilitiesBySeverity = [], recentActivity = []
  } = analytics || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Shield size={24} className="text-cyan-400" /> Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Security Operations Center — Live Overview</p>
      </div>

      {/* Stats Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Incidents" value={totalIncidents} icon={AlertTriangle} color="cyan" />
        <StatCard title="Open Incidents" value={openIncidents} icon={Clock} color="yellow" />
        <StatCard title="Critical Alerts" value={criticalIncidents} icon={Shield} color="red" />
        <StatCard title="Resolved" value={resolvedIncidents} icon={CheckCircle} color="green" />
      </div>

      {/* Stats Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Vulnerabilities" value={totalVulnerabilities} icon={Bug} color="orange" />
        <StatCard title="Open Vulns" value={openVulnerabilities} icon={Bug} color="red" />
        <StatCard title="Total Users" value={totalUsers} icon={Users} color="cyan" />
        <StatCard title="Active Users" value={activeUsers} icon={Activity} color="green" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Incidents by Severity</h2>
          <SeverityPieChart data={incidentsBySeverity.map(d => ({ name: d._id, value: d.count }))} />
        </div>
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Incidents by Category</h2>
          <CategoryBarChart data={incidentsByCategory.map(d => ({ name: d._id, count: d.count }))} />
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
        <h2 className="text-white font-semibold mb-4">Monthly Incident Trend</h2>
        <MonthlyTrendChart data={monthlyIncidents.map(d => ({ month: d.month, count: d.count }))} />
      </div>

      {/* Vulnerabilities by Severity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Vulnerabilities by Severity</h2>
          <SeverityPieChart data={vulnerabilitiesBySeverity.map(d => ({ name: d._id, value: d.count }))} />
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2"><Activity size={16} className="text-cyan-400" /> Recent Activity</h2>
            <Link to="/admin/audit-logs" className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">View all <ArrowRight size={14} /></Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No activity logged yet.</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.slice(0, 8).map(log => (
                <div key={log._id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#1a2847] transition-colors">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 truncate">{log.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{log.userEmail} • {formatDate(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/incidents', label: 'Manage Incidents', icon: AlertTriangle, color: 'text-cyan-400' },
          { to: '/vulnerabilities', label: 'Manage Vulnerabilities', icon: Bug, color: 'text-orange-400' },
          { to: '/admin/users', label: 'User Management', icon: Users, color: 'text-green-400' },
          { to: '/admin/audit-logs', label: 'Audit Logs', icon: Activity, color: 'text-purple-400' },
        ].map(item => (
          <Link key={item.to} to={item.to} className="bg-[#111c35] border border-[#1a2847] hover:border-cyan-500/40 rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all group">
            <item.icon size={22} className={`${item.color} group-hover:scale-110 transition-transform`} />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
