import React from 'react'

const EmptyState = ({ icon: Icon, title = 'Nothing here', message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-[#111c35] border border-[#1a2847] flex items-center justify-center mb-4">
          <Icon size={28} className="text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      {message && <p className="text-sm text-gray-500 max-w-xs mb-6">{message}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="cyber-btn"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
