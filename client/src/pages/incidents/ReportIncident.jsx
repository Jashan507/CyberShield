import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Send, ArrowLeft } from 'lucide-react'
import axiosInstance from '../../api/axios'

const CATEGORIES = ['Phishing Attack','Malware Infection','Unauthorized Access','Data Breach','Suspicious Activity','Ransomware','Social Engineering','Other']
const SEVERITIES = ['Low','Medium','High','Critical']

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm text-gray-300 mb-1.5 font-medium">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
)

const inputClass = "w-full bg-[#1a2847] border border-[#2d3f6b] text-white rounded-lg px-3 py-2.5 text-sm focus:border-cyan-400 outline-none transition-colors placeholder-gray-500"

const ReportIncident = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', category: 'Phishing Attack', severity: 'Medium',
    dateOccurred: new Date().toISOString().split('T')[0], affectedSystem: '', evidence: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.affectedSystem.trim()) e.affectedSystem = 'Affected system is required'
    if (!form.dateOccurred) e.dateOccurred = 'Date is required'
    return e
  }

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }
    setSubmitting(true)
    try {
      await axiosInstance.post('/incidents', form)
      setSuccess(true)
      setTimeout(() => navigate('/incidents'), 1500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit incident.'
      setErrors({ submit: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-white hover:bg-[#1a2847] rounded-lg transition-colors"><ArrowLeft size={18} /></button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><AlertTriangle size={22} className="text-cyan-400" /> Report Incident</h1>
          <p className="text-gray-400 text-sm">Document a cybersecurity incident</p>
        </div>
      </div>

      {success && (
        <div className="bg-green-900/30 border border-green-500/50 text-green-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
          <span>✓</span> Incident reported successfully! Redirecting...
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg px-4 py-3 text-sm">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#111c35] border border-[#1a2847] rounded-xl p-6 space-y-5">
        <Field label="Incident Title *" error={errors.title}>
          <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)}
            placeholder="e.g., Suspicious login attempt from unknown IP"
            className={`${inputClass} ${errors.title ? 'border-red-500' : ''}`} />
        </Field>

        <Field label="Description *" error={errors.description}>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
            placeholder="Describe the incident in detail — what happened, when, how you discovered it..."
            rows={4} className={`${inputClass} resize-none ${errors.description ? 'border-red-500' : ''}`} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Category *">
            <select value={form.category} onChange={e => handleChange('category', e.target.value)} className={inputClass}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Severity *">
            <select value={form.severity} onChange={e => handleChange('severity', e.target.value)} className={inputClass}>
              {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Date of Occurrence *" error={errors.dateOccurred}>
            <input type="date" value={form.dateOccurred} onChange={e => handleChange('dateOccurred', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`${inputClass} ${errors.dateOccurred ? 'border-red-500' : ''}`} />
          </Field>
          <Field label="Affected System *" error={errors.affectedSystem}>
            <input type="text" value={form.affectedSystem} onChange={e => handleChange('affectedSystem', e.target.value)}
              placeholder="e.g., Web Server, Email System, Database"
              className={`${inputClass} ${errors.affectedSystem ? 'border-red-500' : ''}`} />
          </Field>
        </div>

        <Field label="Evidence / Reference URL (optional)">
          <input type="text" value={form.evidence} onChange={e => handleChange('evidence', e.target.value)}
            placeholder="URL, file path, or screenshot reference"
            className={inputClass} />
        </Field>

        {/* Severity indicator */}
        <div className={`rounded-lg px-4 py-3 text-sm border ${
          form.severity === 'Critical' ? 'bg-red-900/20 border-red-500/40 text-red-300' :
          form.severity === 'High' ? 'bg-orange-900/20 border-orange-500/40 text-orange-300' :
          form.severity === 'Medium' ? 'bg-yellow-900/20 border-yellow-500/40 text-yellow-300' :
          'bg-green-900/20 border-green-500/40 text-green-300'
        }`}>
          <strong>Severity: {form.severity}</strong>
          {form.severity === 'Critical' && ' — Requires immediate attention. Will be escalated to the security team.'}
          {form.severity === 'High' && ' — High priority. Will be reviewed within 4 hours.'}
          {form.severity === 'Medium' && ' — Will be reviewed within 24 hours.'}
          {form.severity === 'Low' && ' — Will be reviewed in the next scheduled review cycle.'}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white border border-[#2d3f6b] rounded-lg transition-colors">Cancel</button>
          <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors disabled:opacity-60">
            <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Incident Report'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReportIncident
