import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Home } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center">
        <div className="relative inline-block mb-6">
          <span
            className="glitch text-[10rem] font-bold text-white leading-none select-none relative"
            data-text="404"
            style={{ display: 'inline-block', position: 'relative' }}
          >
            404
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield size={20} className="text-cyan-400" />
          <h1 className="text-xl font-semibold text-white">Page Not Found</h1>
        </div>

        <p className="text-gray-400 mb-10 max-w-sm mx-auto text-sm">
          The resource you're looking for doesn't exist or has been moved.
          Access may be restricted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 cyber-btn"
          >
            <Home size={16} />
            Back to Dashboard
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors px-4 py-2"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
