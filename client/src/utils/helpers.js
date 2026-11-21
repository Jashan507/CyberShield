/**
 * Format a date string or Date object to a readable string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid Date'
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format date to short format (no time)
 */
export const formatDateShort = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid Date'
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Returns Tailwind CSS classes for severity badge
 */
export const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'low':
      return 'bg-green-900 text-green-300 border border-green-700'
    case 'medium':
      return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
    case 'high':
      return 'bg-orange-900 text-orange-300 border border-orange-700'
    case 'critical':
      return 'bg-red-900 text-red-300 border border-red-700'
    default:
      return 'bg-gray-800 text-gray-300 border border-gray-600'
  }
}

/**
 * Returns Tailwind CSS classes for status badge
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'submitted':
      return 'bg-blue-900 text-blue-300 border border-blue-700'
    case 'under investigation':
      return 'bg-purple-900 text-purple-300 border border-purple-700'
    case 'in progress':
      return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
    case 'resolved':
      return 'bg-green-900 text-green-300 border border-green-700'
    case 'closed':
      return 'bg-gray-800 text-gray-400 border border-gray-600'
    case 'open':
      return 'bg-red-900 text-red-300 border border-red-700'
    case 'under review':
      return 'bg-purple-900 text-purple-300 border border-purple-700'
    case 'patched':
      return 'bg-green-900 text-green-300 border border-green-700'
    case 'accepted risk':
      return 'bg-orange-900 text-orange-300 border border-orange-700'
    default:
      return 'bg-gray-800 text-gray-300 border border-gray-600'
  }
}

/**
 * Returns Tailwind CSS classes for role badge
 */
export const getRoleColor = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-cyan-900 text-cyan-300 border border-cyan-700'
    case 'user':
      return 'bg-slate-800 text-slate-300 border border-slate-600'
    default:
      return 'bg-gray-800 text-gray-300 border border-gray-600'
  }
}

/**
 * Truncate a string to n characters
 */
export const truncate = (str, n = 50) => {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '...' : str
}

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Debounce function
 */
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
