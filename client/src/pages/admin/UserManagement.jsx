import React, { useEffect, useState, useCallback } from 'react'
import { Search, Users, Shield, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react'
import axiosInstance from '../../api/axios'
import Badge from '../../components/ui/Badge'
import Loader from '../../components/ui/Loader'
import Modal from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import { formatDate } from '../../utils/helpers'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [confirmModal, setConfirmModal] = useState({ open: false, user: null, action: null })
  const [updating, setUpdating] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams({ page, limit: 10 })
      if (search) params.set('search', search)
      if (roleFilter) params.set('role', roleFilter)
      const res = await axiosInstance.get(`/admin/users?${params}`)
      setUsers(res.data.data || [])
      setTotalPages(res.data.pagination?.pages || 1)
    } catch { setError('Failed to load users.') }
    finally { setLoading(false) }
  }, [page, search, roleFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleAction = async () => {
    if (!confirmModal.user || !confirmModal.action) return
    setUpdating(true)
    try {
      const payload = confirmModal.action === 'toggleRole'
        ? { role: confirmModal.user.role === 'admin' ? 'user' : 'admin' }
        : { isActive: !confirmModal.user.isActive }
      await axiosInstance.put(`/admin/users/${confirmModal.user._id}`, payload)
      setConfirmModal({ open: false, user: null, action: null })
      fetchUsers()
    } catch (err) { alert(err.response?.data?.message || 'Failed to update user.') }
    finally { setUpdating(false) }
  }

  const getActionLabel = () => {
    if (!confirmModal.action || !confirmModal.user) return ''
    if (confirmModal.action === 'toggleRole') return confirmModal.user.role === 'admin' ? 'Revoke admin access' : 'Grant admin access'
    return confirmModal.user.isActive ? 'Deactivate account' : 'Activate account'
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users size={22} className="text-cyan-400" /> User Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage registered accounts and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (setPage(1), fetchUsers())}
            className="w-full bg-[#1a2847] border border-[#2d3f6b] text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:border-cyan-400 outline-none" />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
          className="bg-[#1a2847] border border-[#2d3f6b] text-gray-300 rounded-lg px-3 py-2 text-sm focus:border-cyan-400 outline-none">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={() => { setSearch(''); setRoleFilter(''); setPage(1) }}
          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white border border-[#2d3f6b] rounded-lg hover:border-cyan-500/40 transition-colors">
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader size="lg" /></div>
        : error ? <div className="bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
        : users.length === 0 ? <EmptyState icon={Users} title="No users found" message="No users match your search criteria." />
        : (
          <div className="bg-[#111c35] border border-[#1a2847] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1a2847] text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Department</th>
                    <th className="text-left px-4 py-3">Last Login</th>
                    <th className="text-left px-4 py-3">Logins</th>
                    <th className="text-left px-4 py-3">Joined</th>
                    <th className="text-left px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u._id} className={`border-b border-[#1a2847]/50 hover:bg-[#1a2847]/40 transition-colors ${idx % 2 === 0 ? 'bg-[#0d1526]/50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center shrink-0">
                            <span className="text-cyan-400 text-xs font-bold">{u.name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.name}</p>
                            <p className="text-gray-500 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge text={u.role} variant="role" /></td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.department || '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.lastLogin ? formatDate(u.lastLogin) : 'Never'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.loginCount || 0}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setConfirmModal({ open: true, user: u, action: 'toggleActive' })}
                            className={`p-1.5 rounded transition-colors ${u.isActive ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-green-400 hover:bg-green-900/30'}`}
                            title={u.isActive ? 'Deactivate' : 'Activate'}>
                            {u.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          </button>
                          <button
                            onClick={() => setConfirmModal({ open: true, user: u, action: 'toggleRole' })}
                            className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/30 rounded transition-colors"
                            title="Change Role">
                            <Shield size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#1a2847]">
                <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1 text-sm bg-[#1a2847] text-gray-300 rounded disabled:opacity-40 hover:bg-[#2d3f6b] transition-colors">Prev</button>
                  <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className="px-3 py-1 text-sm bg-[#1a2847] text-gray-300 rounded disabled:opacity-40 hover:bg-[#2d3f6b] transition-colors">Next</button>
                </div>
              </div>
            )}
          </div>
        )
      }

      {/* Confirm Modal */}
      <Modal isOpen={confirmModal.open} onClose={() => setConfirmModal({ open: false, user: null, action: null })} title="Confirm Action">
        <div className="text-sm text-gray-300 mb-6">
          <p>Are you sure you want to <strong className="text-white">{getActionLabel()}</strong> for:</p>
          <p className="mt-2 text-cyan-400 font-medium">{confirmModal.user?.name} ({confirmModal.user?.email})?</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirmModal({ open: false, user: null, action: null })} className="px-4 py-2 text-sm text-gray-400 border border-[#2d3f6b] rounded-lg hover:text-white transition-colors">Cancel</button>
          <button onClick={handleAction} disabled={updating} className="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-60">
            {updating ? 'Updating...' : 'Confirm'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default UserManagement
