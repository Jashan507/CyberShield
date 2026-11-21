import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Bug, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react'
import axiosInstance from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Loader from '../../components/ui/Loader'
import { formatDate, truncate } from '../../utils/helpers'

const UserDashboard = () => {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [vulnerabilities, setVulnerabilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incRes, vulnRes] = await Promise.all([
          axiosInstance.get('/incidents?limit=100'),
          axiosInstance.get('/vulnerabilities?limit=100'),
        ])
        setIncidents(incRes.data.data || [])
        setVulnerabilities(vulnRes.data.data || [])
      } catch (err) {
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>

  const open = incidents.filter(i => !['Resolved','Closed'].includes(i.status)).length
  const resolved = incidents.filter(i => ['Resolved','Closed'].includes(i.status)).length
  const recentIncidents = [...incidents].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5)
  const recentVulns = [...vulnerabilities].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, <span className="text-cyan-400">{user?.name}</span></h1>
          <p className="text-gray-400 text-sm mt-1">Here's your security overview</p>
        </div>
        <div className="flex gap-3">
          <Link to="/incidents/new" className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg px-4 py-2 text-sm transition-colors">
            <Plus size={16} /> Report Incident
          </Link>
          <Link to="/vulnerabilities/new" className="flex items-center gap-2 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-semibold rounded-lg px-4 py-2 text-sm transition-colors">
            <Plus size={16} /> Report Vulnerability
          </Link>
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Incidents" value={incidents.length} icon={AlertTriangle} color="cyan" />
        <StatCard title="Open" value={open} icon={Clock} color="yellow" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle} color="green" />
        <StatCard title="Vulnerabilities" value={vulnerabilities.length} icon={Bug} color="red" />
      </div>

      {/* Recent Incidents */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2"><AlertTriangle size={18} className="text-cyan-400" /> Recent Incidents</h2>
            <Link to="/incidents" className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">View all <ArrowRight size={14} /></Link>
          </div>
          {recentIncidents.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No incidents reported yet.</p>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map(inc => (
                <Link key={inc._id} to={`/incidents/${inc._id}`} className="flex items-start justify-between p-3 rounded-lg bg-[#0d1526] hover:bg-[#1a2847] transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate group-hover:text-cyan-400 transition-colors">{truncate(inc.title, 40)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{inc.category} • {formatDate(inc.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                    <Badge text={inc.severity} variant="severity" />
                    <Badge text={inc.status} variant="status" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Vulnerabilities */}
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2"><Bug size={18} className="text-cyan-400" /> Recent Vulnerabilities</h2>
            <Link to="/vulnerabilities" className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">View all <ArrowRight size={14} /></Link>
          </div>
          {recentVulns.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No vulnerabilities reported yet.</p>
          ) : (
            <div className="space-y-3">
              {recentVulns.map(vuln => (
                <div key={vuln._id} className="flex items-start justify-between p-3 rounded-lg bg-[#0d1526]">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{truncate(vuln.title, 40)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{vuln.vulnerabilityType} • {formatDate(vuln.createdAt)}</p>
                    {vuln.cveId && <p className="text-xs text-cyan-500 mt-0.5 font-mono">{vuln.cveId}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-3 shrink-0">
                    <Badge text={vuln.severity} variant="severity" />
                    <Badge text={vuln.status} variant="vulnStatus" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
