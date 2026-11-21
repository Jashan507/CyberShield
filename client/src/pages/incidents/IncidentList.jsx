import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, RefreshCw, Eye, Trash2, AlertTriangle } from 'lucide-react'
import axiosInstance from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import Badge from '../../components/ui/Badge'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate, truncate } from '../../utils/helpers'

const CATEGORIES = ['','Phishing Attack','Malware Infection','Unauthorized Access','Data Breach','Suspicious Activity','Ransomware','Social Engineering','Other']
const SEVERITIES = ['','Low','Medium','High','Critical']
const STATUSES = ['','Submitted','Under Investigation','In Progress','Resolved','Closed']

const IncidentList = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: '', severity: '', category: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null })
  const [deleting, setDeleting] = useState(false)

  const fetchIncidents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page, limit: 10 })
      if (search) params.set('search', search)
      if (filters.status) params.set('status', filters.status)
      if (filters.severity) params.set('severity', filters.severity)
      if (filters.category) params.set('category', filters.category)
      const res = await axiosInstance.get(`/incidents?${params}`)
      setIncidents(res.data.data || [])
      setTotalPages(res.data.pagination?.pages || 1)
    } catch {
      setError('Failed to load incidents.')
    } finally {
      setLoading(false)
    }
  }, [page, search, filters])

  useEffect(() => { fetchIncidents() }, [fetchIncidents])

  const handleDelete = async () => {
    if (!deleteModal.id) return
    setDeleting(true)
    try {
      await axiosInstance.delete(`/incidents/${deleteModal.id}`)
      setDeleteModal({ open: false, id: null })
      fetchIncidents()
    } catch {
      alert('Failed to delete incident.')
    } finally {
      setDeleting(false)
    }
  }

  const handleSearchSubmit = (e) => { e.preventDefault(); setPage(1); fetchIncidents() }
  const handleFilterChange = (key, val) => { setFilters(prev => ({ ...prev, [key]: val })); setPage(1) }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><AlertTriangle size={22} className="text-cyan-400" /> Incidents</h1>
          <p className="text-gray-400 text-sm mt-1">{isAdmin ? 'All reported security incidents' : 'Your reported incidents'}</p>
        </div>
        <Link to="/incidents/new" className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg px-4 py-2 text-sm transition-colors whitespace-nowrap">
          <Plus size={16} /> Report Incident
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1a2847] border border-[#2d3f6b] text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:border-cyan-400 outline-none"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'status', options: STATUSES, placeholder: 'Status' },
              { key: 'severity', options: SEVERITIES, placeholder: 'Severity' },
              { key: 'category', options: CATEGORIES, placeholder: 'Category' },
            ].map(({ key, options, placeholder }) => (
              <select
                key={key}
                value={filters[key]}
                onChange={e => handleFilterChange(key, e.target.value)}
                className="bg-[#1a2847] border border-[#2d3f6b] text-gray-300 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none"
              >
                <option value="">{placeholder}</option>
                {options.filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
            <button type="button" onClick={() => { setSearch(''); setFilters({ status: '', severity: '', category: '' }); setPage(1) }}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white border border-[#2d3f6b] rounded-lg hover:border-cyan-500/40 transition-colors">
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader size="lg" /></div>
      ) : error ? (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
      ) : incidents.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No incidents found" message="Try adjusting your filters or report a new incident." action={<Link to="/incidents/new" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg px-4 py-2 text-sm flex items-center gap-2 transition-colors"><Plus size={16} />Report Incident</Link>} />
      ) : (
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a2847] text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Severity</th>
                  <th className="text-left px-4 py-3">Status</th>
                  {isAdmin && <th className="text-left px-4 py-3">Reporter</th>}
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc, idx) => (
                  <tr key={inc._id} className={`border-b border-[#1a2847]/50 hover:bg-[#1a2847]/40 transition-colors ${idx % 2 === 0 ? 'bg-[#0d1526]/50' : ''}`}>
                    <td className="px-4 py-3">
                      <Link to={`/incidents/${inc._id}`} className="text-white hover:text-cyan-400 font-medium transition-colors">{truncate(inc.title, 40)}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{inc.category}</td>
                    <td className="px-4 py-3"><Badge text={inc.severity} variant="severity" /></td>
                    <td className="px-4 py-3"><Badge text={inc.status} variant="status" /></td>
                    {isAdmin && <td className="px-4 py-3 text-gray-400 text-xs">{inc.reportedBy?.name || inc.reportedBy?.email || '—'}</td>}
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(inc.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/incidents/${inc._id}`} className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/30 rounded transition-colors" title="View"><Eye size={15} /></Link>
                        {(isAdmin || (inc.reportedBy?._id === user?._id && inc.status === 'Submitted')) && (
                          <button onClick={() => setDeleteModal({ open: true, id: inc._id })} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors" title="Delete"><Trash2 size={15} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#1a2847]">
              <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="px-3 py-1 text-sm bg-[#1a2847] text-gray-300 rounded disabled:opacity-40 hover:bg-[#2d3f6b] transition-colors">Prev</button>
                <button disabled={page === totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1 text-sm bg-[#1a2847] text-gray-300 rounded disabled:opacity-40 hover:bg-[#2d3f6b] transition-colors">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} title="Delete Incident">
        <p className="text-gray-300 text-sm mb-6">Are you sure you want to delete this incident? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteModal({ open: false, id: null })} className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-[#2d3f6b] rounded-lg transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default IncidentList
