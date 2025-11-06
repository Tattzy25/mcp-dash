"use client"

import { IconFilter } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StationFiltersProps {
  showFilters: boolean
  selectedGenre: string
  onToggleFilters: () => void
  onGenreChange: (value: string) => void
}

export function StationFilters({
  showFilters,
  selectedGenre,
  onToggleFilters,
  onGenreChange,
}: StationFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onToggleFilters}>
          <IconFilter className="mr-2 h-4 w-4" />
          {showFilters ? "Hide" : "Show"}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Select value={selectedGenre} onValueChange={onGenreChange}>
            <SelectTrigger>
              <SelectValue placeholder="Hip Hop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="hip hop">Hip Hop</SelectItem>
              <SelectItem value="rap">Rap</SelectItem>
              <SelectItem value="r&b">R&B</SelectItem>
              <SelectItem value="reggaeton">Reggaeton</SelectItem>
              <SelectItem value="edm">EDM</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="country">Country</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="metal">Metal</SelectItem>
              <SelectItem value="indie">Indie</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedGenre} onValueChange={onGenreChange}>
            <SelectTrigger>
              <SelectValue placeholder="EDM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="hip hop">Hip Hop</SelectItem>
              <SelectItem value="rap">Rap</SelectItem>
              <SelectItem value="r&b">R&B</SelectItem>
              <SelectItem value="reggaeton">Reggaeton</SelectItem>
              <SelectItem value="edm">EDM</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="country">Country</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="metal">Metal</SelectItem>
              <SelectItem value="indie">Indie</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedGenre} onValueChange={onGenreChange}>
            <SelectTrigger>
              <SelectValue placeholder="Rock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="hip hop">Hip Hop</SelectItem>
              <SelectItem value="rap">Rap</SelectItem>
              <SelectItem value="r&b">R&B</SelectItem>
              <SelectItem value="reggaeton">Reggaeton</SelectItem>
              <SelectItem value="edm">EDM</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="country">Country</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="metal">Metal</SelectItem>
              <SelectItem value="indie">Indie</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedGenre} onValueChange={onGenreChange}>
            <SelectTrigger>
              <SelectValue placeholder="BRIGIT AI HOT MIX" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="hip hop">Hip Hop</SelectItem>
              <SelectItem value="rap">Rap</SelectItem>
              <SelectItem value="r&b">R&B</SelectItem>
              <SelectItem value="reggaeton">Reggaeton</SelectItem>
              <SelectItem value="edm">EDM</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="country">Country</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="metal">Metal</SelectItem>
              <SelectItem value="indie">Indie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
