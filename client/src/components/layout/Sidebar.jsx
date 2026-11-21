import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Shield,
  LayoutDashboard,
  AlertTriangle,
  Plus,
  Bug,
  BarChart2,
  User,
  Users,
  FileText,
  LogOut,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 transition-all duration-200 text-sm font-medium ${
        isActive
          ? 'bg-[#111c35] border-l-2 border-cyan-400 text-cyan-400 pl-3'
          : 'text-gray-400 hover:text-white hover:bg-[#111c35]'
      }`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
)

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [adminExpanded, setAdminExpanded] = useState(true)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onClose?.()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#0d1526] border-r border-[#1a2847] z-30 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-[#1a2847]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center pulse-glow">
              <Shield size={22} className="text-black" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-wide">Cyber</span>
              <span className="text-cyan-400 font-bold text-lg">Shield</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          <NavItem
            to="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            onClick={handleNavClick}
          />
          <NavItem
            to="/incidents"
            icon={AlertTriangle}
            label="Incidents"
            onClick={handleNavClick}
          />
          <NavItem
            to="/incidents/new"
            icon={Plus}
            label="Report Incident"
            onClick={handleNavClick}
          />
          <NavItem
            to="/vulnerabilities"
            icon={Bug}
            label="Vulnerabilities"
            onClick={handleNavClick}
          />
          <NavItem
            to="/vulnerabilities/new"
            icon={Plus}
            label="Report Vulnerability"
            onClick={handleNavClick}
          />
          <NavItem
            to="/analytics"
            icon={BarChart2}
            label="Analytics"
            onClick={handleNavClick}
          />
          <NavItem
            to="/profile"
            icon={User}
            label="Profile"
            onClick={handleNavClick}
          />

          {/* Admin section */}
          {user?.role === 'admin' && (
            <div className="mt-4">
              <button
                onClick={() => setAdminExpanded(!adminExpanded)}
                className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                <span>Admin</span>
                {adminExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {adminExpanded && (
                <div className="mt-1 space-y-1">
                  <NavItem
                    to="/admin/users"
                    icon={Users}
                    label="User Management"
                    onClick={handleNavClick}
                  />
                  <NavItem
                    to="/admin/audit-logs"
                    icon={FileText}
                    label="Audit Logs"
                    onClick={handleNavClick}
                  />
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-[#1a2847] p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center">
              <span className="text-cyan-400 text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
