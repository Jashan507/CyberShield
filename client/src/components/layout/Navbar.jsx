import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import { getInitials } from '../../utils/helpers'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/incidents': 'Incidents',
  '/incidents/new': 'Report Incident',
  '/vulnerabilities': 'Vulnerabilities',
  '/vulnerabilities/new': 'Report Vulnerability',
  '/analytics': 'Analytics',
  '/profile': 'Profile',
  '/admin/users': 'User Management',
  '/admin/audit-logs': 'Audit Logs'
}

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith('/incidents/') ? 'Incident Detail' : 'CyberShield')

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-[#0d1526] border-b border-[#1a2847] flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-400 hover:text-white p-1 rounded transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative p-2 text-gray-400 hover:text-cyan-400 rounded-lg hover:bg-[#111c35] transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#111c35] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center">
              <span className="text-cyan-400 text-xs font-bold">
                {getInitials(user?.name)}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm text-white font-medium leading-none">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">{user?.role}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden md:block" />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#111c35] border border-[#1a2847] rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-[#1a2847]">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  navigate('/profile')
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#1a2847] transition-colors"
              >
                <User size={15} />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
