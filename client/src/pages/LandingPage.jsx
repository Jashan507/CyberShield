import React from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  AlertTriangle,
  Bug,
  BarChart2,
  ArrowRight,
  CheckCircle,
  Lock,
  Activity
} from 'lucide-react'

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6 hover:border-cyan-800 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)] group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
)

const StatBadge = ({ value, label }) => (
  <div className="text-center px-6 py-4 border-r border-[#1a2847] last:border-r-0">
    <p className="text-2xl font-bold text-cyan-400 mb-1">{value}</p>
    <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
  </div>
)

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1e] overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#1a2847]/50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Shield size={22} className="text-black" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-white">Cyber</span>
            <span className="text-cyan-400">Shield</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="cyber-btn text-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-20 pb-24 text-center animated-gradient">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-900/30 border border-cyan-700/50 rounded-full px-4 py-1.5 text-xs text-cyan-400 mb-8">
            <Activity size={12} />
            <span>Enterprise Cybersecurity Management Platform</span>
          </div>

          {/* Logo icon large */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-cyan-500 rounded-2xl flex items-center justify-center pulse-glow shadow-[0_0_40px_rgba(0,212,255,0.3)]">
              <Shield size={44} className="text-black" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Centralized{' '}
            <span className="text-cyan-400 glow-text">Cybersecurity</span>
            <br />
            Incident &amp; Vulnerability
            <br />
            Management
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track, investigate, and resolve security incidents and vulnerabilities with
            real-time analytics, role-based access control, and comprehensive audit logging.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl px-8 py-3.5 text-sm transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 border border-[#2d3f6b] text-gray-300 hover:text-white hover:border-cyan-700 font-semibold rounded-xl px-8 py-3.5 text-sm transition-all"
            >
              <Lock size={16} />
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-[#1a2847] bg-[#0d1526]">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center divide-x divide-[#1a2847]">
          <StatBadge value="500+" label="Incidents Tracked" />
          <StatBadge value="Real-time" label="Monitoring" />
          <StatBadge value="Enterprise" label="Security" />
          <StatBadge value="RBAC" label="Access Control" />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything you need to stay{' '}
              <span className="text-cyan-400">secure</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              A unified platform for security teams to manage incidents, track vulnerabilities,
              and gain actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={AlertTriangle}
              title="Incident Tracking"
              description="Report, track, and investigate security incidents with detailed timelines, severity levels, and investigation notes."
              color="bg-orange-900/40 text-orange-400"
            />
            <FeatureCard
              icon={Bug}
              title="Vulnerability Management"
              description="Document and track vulnerabilities with CVE IDs, CVSS scores, and remediation status across your systems."
              color="bg-red-900/40 text-red-400"
            />
            <FeatureCard
              icon={BarChart2}
              title="Security Analytics"
              description="Visualize trends, severity distributions, and category breakdowns with interactive charts and dashboards."
              color="bg-cyan-900/40 text-cyan-400"
            />
          </div>

          {/* Additional features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6 flex gap-4">
              <div className="w-10 h-10 bg-purple-900/40 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Role-Based Access Control</h3>
                <p className="text-gray-400 text-sm">Separate user and admin roles with tailored dashboards, permissions, and admin-only controls.</p>
              </div>
            </div>
            <div className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6 flex gap-4">
              <div className="w-10 h-10 bg-green-900/40 text-green-400 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Audit Logging</h3>
                <p className="text-gray-400 text-sm">Every action is logged with timestamps, user info, and resource details for full compliance traceability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-20 bg-[#0d1526] border-y border-[#1a2847]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
            <Shield size={32} className="text-black" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to secure your organization?
          </h2>
          <p className="text-gray-400 mb-8">
            Join security teams using CyberShield to manage incidents and vulnerabilities effectively.
          </p>
          <Link to="/register" className="cyber-btn inline-flex items-center gap-2 text-sm">
            Start for Free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#1a2847]">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-cyan-400" />
          <span className="text-sm text-gray-400">
            © 2024 <span className="text-white font-medium">CyberShield</span>. All rights reserved.
          </span>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-gray-300 cursor-pointer transition-colors">Contact</span>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
