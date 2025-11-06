"use client"

import { IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"

interface StationSearchBarProps {
  searchQuery: string
  isSearching: boolean
  onSearchChange: (query: string) => void
  resultsCount: number
}

export function StationSearchBar({
  searchQuery,
  isSearching,
  onSearchChange,
  resultsCount,
}: StationSearchBarProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <IconSearch className="absolute left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search radio stations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 sm:pl-12 h-12 sm:h-14 text-base sm:text-lg"
        />
      </div>
      {isSearching && (
        <p className="text-sm text-muted-foreground mt-2">Searching...</p>
      )}
      {!isSearching && searchQuery && (
        <p className="text-sm text-muted-foreground mt-2">
          Found {resultsCount} station{resultsCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}
