import React from 'react'

const SIZE_MAP = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4'
}

const Loader = ({ size = 'md', text }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${SIZE_MAP[size] || SIZE_MAP.md} rounded-full border-[#1a2847] border-t-cyan-400 animate-spin`}
      />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  )
}

export default Loader
