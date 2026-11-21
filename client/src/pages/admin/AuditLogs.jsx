import React, { useEffect, useState, useCallback } from 'react'
import { FileText, Search, RefreshCw, Filter } from 'lucide-react'
import axiosInstance from '../../api/axios'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate } from '../../utils/helpers'

const ACTIONS = ['','USER_LOGIN','USER_LOGOUT','USER_REGISTER','INCIDENT_CREATED','INCIDENT_UPDATED','INCIDENT_DELETED','VULNERABILITY_CREATED','VULNERABILITY_UPDATED','VULNERABILITY_DELETED','USER_UPDATED','USER_DELETED','ROLE_CHANGED','ADMIN_ACTION']

const actionColors = {
  USER_LOGIN: 'text-green-400 bg-green-900/20',
  USER_LOGOUT: 'text-gray-400 bg-gray-900/20',
  USER_REGISTER: 'text-blue-400 bg-blue-900/20',
  INCIDENT_CREATED: 'text-cyan-400 bg-cyan-900/20',
  INCIDENT_UPDATED: 'text-yellow-400 bg-yellow-900/20',
  INCIDENT_DELETED: 'text-red-400 bg-red-900/20',
  VULNERABILITY_CREATED: 'text-orange-400 bg-orange-900/20',
  VULNERABILITY_UPDATED: 'text-yellow-400 bg-yellow-900/20',
  VULNERABILITY_DELETED: 'text-red-400 bg-red-900/20',
  USER_UPDATED: 'text-purple-400 bg-purple-900/20',
  USER_DELETED: 'text-red-400 bg-red-900/20',
  ROLE_CHANGED: 'text-pink-400 bg-pink-900/20',
  ADMIN_ACTION: 'text-cyan-400 bg-cyan-900/20',
}

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionFilter, setActionFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchLogs = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({ page, limit: 15 })
      if (actionFilter) params.set('action', actionFilter)
      if (search) params.set('search', search)
      const res = await axiosInstance.get(`/admin/audit-logs?${params}`)
      setLogs(res.data.data || [])
      setTotalPages(res.data.pagination?.pages || 1)
      setTotal(res.data.pagination?.total || 0)
    } catch { setError('Failed to load audit logs.') }
    finally { setLoading(false) }
  }, [page, actionFilter, search])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><FileText size={22} className="text-cyan-400" /> Audit Logs</h1>
        <p className="text-gray-400 text-sm mt-1">System activity trail — {total} total events recorded</p>
      </div>

      {/* Filters */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by user email or description..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (setPage(1), fetchLogs())}
            className="w-full bg-[#1a2847] border border-[#2d3f6b] text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:border-cyan-400 outline-none" />
        </div>
        <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1) }}
          className="bg-[#1a2847] border border-[#2d3f6b] text-gray-300 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none min-w-[160px]">
          <option value="">All Actions</option>
          {ACTIONS.filter(Boolean).map(a => <option key={a} value={a}>{a.replace(/_/g,' ')}</option>)}
        </select>
        <button onClick={() => { setSearch(''); setActionFilter(''); setPage(1) }}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white border border-[#2d3f6b] rounded-lg hover:border-cyan-500/40 transition-colors">
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-2 bg-[#111c35] border border-cyan-500/20 rounded-lg px-4 py-3 text-xs text-cyan-400">
        <Filter size={14} />
        Audit logs are read-only. All system events are immutable records for compliance and forensic purposes.
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader size="lg" /></div>
        : error ? <div className="bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
        : logs.length === 0 ? <EmptyState icon={FileText} title="No audit logs found" message="No events match your filter criteria." />
        : (
          <div className="bg-[#111c35] border border-[#1a2847] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1a2847] text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Timestamp</th>
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Action</th>
                    <th className="text-left px-4 py-3">Description</th>
                    <th className="text-left px-4 py-3">IP Address</th>
                    <th className="text-left px-4 py-3">Resource</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, idx) => (
                    <tr key={log._id} className={`border-b border-[#1a2847]/50 hover:bg-[#1a2847]/40 transition-colors ${idx % 2 === 0 ? 'bg-[#0d1526]/50' : ''}`}>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono whitespace-nowrap">{formatDate(log.createdAt)}</td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{log.userEmail || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-mono font-medium ${actionColors[log.action] || 'text-gray-400 bg-gray-900/20'}`}>
                          {log.action?.replace(/_/g,' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs max-w-xs truncate">{log.description || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs font-mono">{log.ipAddress || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs font-mono truncate max-w-[100px]">{log.resourceType ? `${log.resourceType}` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#1a2847]">
                <span className="text-xs text-gray-500">Page {page} of {totalPages} ({total} total)</span>
                <div className="flex gap-2">
                  <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1 text-sm bg-[#1a2847] text-gray-300 rounded disabled:opacity-40 hover:bg-[#2d3f6b] transition-colors">Prev</button>
                  <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className="px-3 py-1 text-sm bg-[#1a2847] text-gray-300 rounded disabled:opacity-40 hover:bg-[#2d3f6b] transition-colors">Next</button>
                </div>
              </div>
            )}
          </div>
        )
      }
    </div>
  )
}

export default AuditLogs
