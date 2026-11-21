import React from 'react'
import { getSeverityColor, getStatusColor, getRoleColor } from '../../utils/helpers'

const Badge = ({ text, variant = 'default' }) => {
  let classes = ''

  if (variant === 'severity') {
    classes = getSeverityColor(text)
  } else if (variant === 'status') {
    classes = getStatusColor(text)
  } else if (variant === 'role') {
    classes = getRoleColor(text)
  } else {
    classes = 'bg-gray-800 text-gray-300 border border-gray-600'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {text || 'Unknown'}
    </span>
  )
}

export default Badge
