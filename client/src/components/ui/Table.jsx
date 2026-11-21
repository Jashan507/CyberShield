import React from 'react'
import Loader from './Loader'
import EmptyState from './EmptyState'
import { FileText } from 'lucide-react'

/**
 * columns: Array of { header, key, render? }
 * data: Array of objects
 * loading: boolean
 * emptyMessage: string
 */
const Table = ({ columns = [], data = [], loading = false, emptyMessage = 'No data found' }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="md" />
      </div>
    )
  }

  if (!loading && data.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No records found"
        message={emptyMessage}
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#1a2847]">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-[#111c35] border-b border-[#1a2847]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row._id || rowIdx}
              className="bg-[#0d1526] border-b border-[#1a2847] hover:bg-[#1a2847] transition-colors"
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-4 py-3 text-gray-300 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
