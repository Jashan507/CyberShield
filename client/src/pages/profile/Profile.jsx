import React, { useState } from 'react'
import { User, Lock, Save, Eye, EyeOff, Building2 } from 'lucide-react'
import axiosInstance from '../../api/axios'
import useAuth from '../../hooks/useAuth'
import Badge from '../../components/ui/Badge'
import { formatDate } from '../../utils/helpers'

const inputClass = "w-full bg-[#1a2847] border border-[#2d3f6b] text-white rounded-lg px-3 py-2.5 text-sm focus:border-cyan-400 outline-none transition-colors placeholder-gray-500"

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', department: user?.department || '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [profileMsg, setProfileMsg] = useState(null)
  const [pwMsg, setPwMsg] = useState(null)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!profileForm.name.trim()) { setProfileMsg({ type: 'error', text: 'Name is required.' }); return }
    setSavingProfile(true); setProfileMsg(null)
    try {
      const res = await axiosInstance.put('/auth/me', { name: profileForm.name, department: profileForm.department })
      updateUser(res.data.data)
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' })
    } finally { setSavingProfile(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'All password fields are required.' }); return
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ type: 'error', text: 'New password must be at least 8 characters.' }); return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return
    }
    setSavingPw(true); setPwMsg(null)
    try {
      await axiosInstance.put('/auth/me', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPwMsg({ type: 'success', text: 'Password changed successfully!' })
    } catch (err) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' })
    } finally { setSavingPw(false) }
  }

  const Msg = ({ msg }) => msg ? (
    <div className={`rounded-lg px-4 py-3 text-sm ${msg.type === 'success' ? 'bg-green-900/30 border border-green-500/50 text-green-400' : 'bg-red-900/30 border border-red-500/50 text-red-400'}`}>
      {msg.text}
    </div>
  ) : null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><User size={22} className="text-cyan-400" /> Profile & Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Account Info Card */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-cyan-900 border-2 border-cyan-500 flex items-center justify-center">
            <span className="text-cyan-400 text-2xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-white text-lg font-semibold">{user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <div className="mt-1"><Badge text={user?.role} variant="role" /></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-[#0d1526] rounded-lg p-3">
            <p className="text-gray-500 text-xs mb-1">Department</p>
            <p className="text-white">{user?.department || 'Not set'}</p>
          </div>
          <div className="bg-[#0d1526] rounded-lg p-3">
            <p className="text-gray-500 text-xs mb-1">Member Since</p>
            <p className="text-white">{formatDate(user?.createdAt)}</p>
          </div>
          <div className="bg-[#0d1526] rounded-lg p-3">
            <p className="text-gray-500 text-xs mb-1">Last Login</p>
            <p className="text-white">{user?.lastLogin ? formatDate(user.lastLogin) : 'Now'}</p>
          </div>
          <div className="bg-[#0d1526] rounded-lg p-3">
            <p className="text-gray-500 text-xs mb-1">Total Logins</p>
            <p className="text-white">{user?.loginCount || 1}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2"><User size={16} className="text-cyan-400" /> Edit Profile</h2>
        <Msg msg={profileMsg} />
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">Full Name</label>
            <input type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
              className={inputClass} placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">Email (read-only)</label>
            <input type="email" value={user?.email || ''} disabled
              className={`${inputClass} opacity-50 cursor-not-allowed`} />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5 font-medium flex items-center gap-1"><Building2 size={14} /> Department</label>
            <input type="text" value={profileForm.department} onChange={e => setProfileForm(p => ({ ...p, department: e.target.value }))}
              className={inputClass} placeholder="e.g., Security Operations, IT, Development" />
          </div>
          <button type="submit" disabled={savingProfile} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors disabled:opacity-60">
            <Save size={15} /> {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold flex items-center gap-2"><Lock size={16} className="text-cyan-400" /> Change Password</h2>
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg px-4 py-3 text-xs text-yellow-400">
          Password must be at least 8 characters. Use a mix of letters, numbers, and symbols for security.
        </div>
        <Msg msg={pwMsg} />
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">Current Password</label>
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} value={pwForm.currentPassword}
                onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                className={`${inputClass} pr-10`} placeholder="••••••••" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">New Password</label>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={pwForm.newPassword}
                onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                className={`${inputClass} pr-10`} placeholder="••••••••" />
              <button type="button" onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1.5 font-medium">Confirm New Password</label>
            <input type="password" value={pwForm.confirmPassword}
              onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
              className={inputClass} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={savingPw} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors disabled:opacity-60">
            <Lock size={15} /> {savingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
