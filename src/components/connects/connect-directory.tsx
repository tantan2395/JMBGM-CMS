'use client'

import { useMemo, useState } from 'react'
import { Filter } from 'lucide-react'
import { CONNECT_CATEGORIES, type ConnectCategory } from '@/lib/constants/connect'
import { ConnectCard, type ConnectCardData } from '@/components/connects/connect-card'

type ConnectDirectoryProps = {
  connects: ConnectCardData[]
}

export function ConnectDirectory({ connects }: ConnectDirectoryProps) {
  const [selected, setSelected] = useState<ConnectCategory | 'all'>('all')

  const filtered = useMemo(() => {
    if (selected === 'all') return connects
    return connects.filter((connect) => connect.category === selected)
  }, [connects, selected])

  return (
    <div className="space-y-6">
      <div className="space-y-3 border-b border-[#E2D9CC] pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2F3E33]">
          <Filter className="h-3.5 w-3.5 text-[#C1683B]" />
          <span>Filter by life stage</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelected('all')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              selected === 'all'
                ? 'bg-[#C1683B] text-white shadow-sm font-semibold'
                : 'bg-white border border-[#E2D9CC] text-[#5C6F62] hover:text-[#2F3E33] hover:bg-[#EFE8DC]/60'
            }`}
          >
            All Ministries ({connects.length})
          </button>
          {CONNECT_CATEGORIES.map((option) => {
            const count = connects.filter((connect) => connect.category === option.value).length
            if (count === 0) return null
            const isSelected = selected === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelected(option.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#C1683B] text-white shadow-sm font-semibold'
                    : 'bg-white border border-[#E2D9CC] text-[#5C6F62] hover:text-[#2F3E33] hover:bg-[#EFE8DC]/60'
                }`}
              >
                {option.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[#5C6F62] py-8">
          No ministries in this category yet. Try another filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((connect) => (
            <ConnectCard key={connect.id} connect={connect} />
          ))}
        </div>
      )}
    </div>
  )
}
