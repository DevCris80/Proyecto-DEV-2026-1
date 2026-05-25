import type { ReactNode } from "react"

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => ReactNode
}

interface GlassTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onRowClick?: (item: T) => void
}

export default function GlassTable<T>({ columns, data, keyExtractor, onRowClick }: GlassTableProps<T>) {
  return (
    <div className="glass rounded-[2rem] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-glass-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-6 py-4 text-[10px] uppercase tracking-[0.3em] text-white/60 font-satoshi font-bold"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-sm text-white/50 font-satoshi"
              >
                No hay datos disponibles
              </td>
            </tr>
          )}
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className="border-b border-glass-border last:border-b-0 transition-colors duration-300 hover:bg-white/[0.02] cursor-pointer"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-white/90 font-satoshi">
                  {col.render ? col.render(item) : (item as Record<string, ReactNode>)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
