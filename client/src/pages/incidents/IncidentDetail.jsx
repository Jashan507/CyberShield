import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit2, MessageSquare, Clock, User, Shield, AlertTriangle, CheckCircle, X } from 'lucide-react'
import axiosInstance from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import Badge from '../../components/ui/Badge'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import { formatDate } from '../../utils/helpers'

const STATUSES = ['Submitted','Under Investigation','In Progress','Resolved','Closed']

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2.5 border-b border-[#1a2847]/50">
    <span className="text-gray-500 text-sm w-40 shrink-0">{label}</span>
    <span className="text-gray-200 text-sm">{value || '—'}</span>
  </div>
)

const IncidentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [incident, setIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [noteModal, setNoteModal] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [noteSubmitting, setNoteSubmitting] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [editForm, setEditForm] = useState({})

  const fetchIncident = async () => {
    try {
      const res = await axiosInstance.get(`/incidents/${id}`)
      setIncident(res.data.data)
      setEditForm({
        title: res.data.data.title,
        description: res.data.data.description,
        category: res.data.data.category,
        severity: res.data.data.severity,
        affectedSystem: res.data.data.affectedSystem,
        dateOccurred: res.data.data.dateOccurred?.split('T')[0] || '',
        evidence: res.data.data.evidence || '',
      })
    } catch {
      setError('Failed to load incident details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchIncident() }, [id])

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)
    try {
      await axiosInstance.put(`/incidents/${id}`, { status: newStatus })
      await fetchIncident()
    } catch { alert('Failed to update status.') }
    finally { setStatusUpdating(false) }
  }

  const handleAddNote = async () => {
    if (!noteText.trim()) return
    setNoteSubmitting(true)
    try {
      await axiosInstance.put(`/incidents/${id}`, { addNote: noteText })
      setNoteText(''); setNoteModal(false)
      await fetchIncident()
    } catch { alert('Failed to add note.') }
    finally { setNoteSubmitting(false) }
  }

  const handleEdit = async () => {
    setNoteSubmitting(true)
    try {
      await axiosInstance.put(`/incidents/${id}`, editForm)
      setEditModal(false)
      await fetchIncident()
    } catch (err) { alert(err.response?.data?.message || 'Failed to update.') }
    finally { setNoteSubmitting(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>
  if (error) return <div className="bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg px-4 py-3">{error}</div>
  if (!incident) return null

  const isOwner = incident.reportedBy?._id === user?._id || incident.reportedBy === user?._id
  const canEdit = isAdmin || (isOwner && incident.status === 'Submitted')

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button onClick={() => navigate(-1)} className="p-2 mt-1 text-gray-400 hover:text-white hover:bg-[#1a2847] rounded-lg transition-colors shrink-0"><ArrowLeft size={18} /></button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge text={incident.severity} variant="severity" />
            <Badge text={incident.status} variant="status" />
          </div>
          <h1 className="text-xl font-bold text-white">{incident.title}</h1>
          <p className="text-gray-500 text-sm mt-1">Reported {formatDate(incident.createdAt)}</p>
        </div>
        {canEdit && (
          <button onClick={() => setEditModal(true)} className="flex items-center gap-2 px-3 py-2 text-sm text-cyan-400 border border-cyan-500/40 hover:bg-cyan-900/20 rounded-lg transition-colors">
            <Edit2 size={15} /> Edit
          </button>
        )}
      </div>

      {/* Main card */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6 space-y-1">
        <InfoRow label="Category" value={incident.category} />
        <InfoRow label="Affected System" value={incident.affectedSystem} />
        <InfoRow label="Date Occurred" value={formatDate(incident.dateOccurred)} />
        <InfoRow label="Reported By" value={incident.reportedBy?.name || incident.reportedBy?.email} />
        {incident.assignedTo && <InfoRow label="Assigned To" value={incident.assignedTo?.name || incident.assignedTo?.email} />}
        {incident.resolvedAt && <InfoRow label="Resolved At" value={formatDate(incident.resolvedAt)} />}
        {incident.evidence && (
          <div className="py-2.5">
            <span className="text-gray-500 text-sm">Evidence</span>
            <p className="text-cyan-400 text-sm mt-1 break-all">{incident.evidence}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-cyan-400" /> Description</h2>
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{incident.description}</p>
      </div>

      {/* Admin: Status Update */}
      {isAdmin && (
        <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2"><Shield size={16} className="text-cyan-400" /> Update Status</h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map(s => (
              <button key={s} onClick={() => handleStatusChange(s)} disabled={statusUpdating || incident.status === s}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  incident.status === s
                    ? 'bg-cyan-500 text-black cursor-default'
                    : 'bg-[#1a2847] text-gray-300 hover:bg-[#2d3f6b] border border-[#2d3f6b]'
                } disabled:opacity-60`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Investigation Notes */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold flex items-center gap-2"><MessageSquare size={16} className="text-cyan-400" /> Investigation Notes ({incident.investigationNotes?.length || 0})</h2>
          {isAdmin && (
            <button onClick={() => setNoteModal(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm text-cyan-400 border border-cyan-500/40 hover:bg-cyan-900/20 rounded-lg transition-colors">
              <MessageSquare size={14} /> Add Note
            </button>
          )}
        </div>
        {(!incident.investigationNotes || incident.investigationNotes.length === 0) ? (
          <p className="text-gray-500 text-sm">No investigation notes yet.</p>
        ) : (
          <div className="space-y-3">
            {incident.investigationNotes.map((n, i) => (
              <div key={i} className="bg-[#0d1526] border border-[#1a2847] rounded-lg p-4">
                <p className="text-gray-200 text-sm leading-relaxed">{n.note}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <User size={12} /><span>{n.addedBy?.name || n.addedBy?.email || 'Admin'}</span>
                  <Clock size={12} /><span>{formatDate(n.addedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      <Modal isOpen={noteModal} onClose={() => setNoteModal(false)} title="Add Investigation Note">
        <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
          placeholder="Enter your investigation note..."
          rows={5} className="w-full bg-[#1a2847] border border-[#2d3f6b] text-white rounded-lg px-3 py-2.5 text-sm focus:border-cyan-400 outline-none resize-none mb-4" />
        <div className="flex gap-3 justify-end">
          <button onClick={() => setNoteModal(false)} className="px-4 py-2 text-sm text-gray-400 border border-[#2d3f6b] rounded-lg hover:text-white transition-colors">Cancel</button>
          <button onClick={handleAddNote} disabled={noteSubmitting || !noteText.trim()} className="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-60">
            {noteSubmitting ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Incident" size="lg">
        <div className="space-y-4">
          {['title','affectedSystem'].map(key => (
            <div key={key}>
              <label className="block text-sm text-gray-300 mb-1 capitalize">{key === 'affectedSystem' ? 'Affected System' : key}</label>
              <input value={editForm[key] || ''} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                className="w-full bg-[#1a2847] border border-[#2d3f6b] text-white rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none" />
            </div>
          ))}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
              rows={4} className="w-full bg-[#1a2847] border border-[#2d3f6b] text-white rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{key:'severity',opts:['Low','Medium','High','Critical']},{key:'category',opts:['Phishing Attack','Malware Infection','Unauthorized Access','Data Breach','Suspicious Activity','Ransomware','Social Engineering','Other']}].map(({key,opts}) => (
              <div key={key}>
                <label className="block text-sm text-gray-300 mb-1 capitalize">{key}</label>
                <select value={editForm[key] || ''} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full bg-[#1a2847] border border-[#2d3f6b] text-gray-300 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none">
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setEditModal(false)} className="px-4 py-2 text-sm text-gray-400 border border-[#2d3f6b] rounded-lg hover:text-white transition-colors">Cancel</button>
            <button onClick={handleEdit} disabled={noteSubmitting} className="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-60">
              {noteSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default IncidentDetail
