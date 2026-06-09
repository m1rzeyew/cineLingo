import { cn } from '../../utils/helpers'

export default function Table({ columns, data, loading, emptyMessage = 'No data found.', onRowClick }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-cream-200 overflow-hidden">
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 skeleton" style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-cream-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream-100 border-b border-cream-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-5 py-3.5 text-left text-xs font-semibold text-dark-600 uppercase tracking-wide',
                    col.className,
                  )}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-dark-600"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data?.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'hover:bg-cream-50 transition-colors',
                    onRowClick && 'cursor-pointer',
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn('px-5 py-4', col.cellClass)}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg text-sm border border-cream-300 disabled:opacity-40 hover:bg-cream-100 transition-colors"
      >
        ← Prev
      </button>
      <span className="text-sm text-dark-600 px-2">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm border border-cream-300 disabled:opacity-40 hover:bg-cream-100 transition-colors"
      >
        Next →
      </button>
    </div>
  )
}
