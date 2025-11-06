"use client"

import { useState, useRef } from "react"
import { Station } from "./types/station"
import { StationSearchBar } from "./components/StationSearchBar"
import { StationList } from "./components/StationList"
import { LoadMoreButton } from "./components/LoadMoreButton"
import { useStationSearch } from "./hooks/useStationSearch"
import { useStationFilters } from "./hooks/useStationFilters"
import { useStationPagination } from "./hooks/useStationPagination"
import { Speaker } from "@/components/speaker"

interface StationsGridProps {
  initialStations: Station[]
}

export function StationsGrid({ initialStations }: StationsGridProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [currentStation, setCurrentStation] = useState<Station | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { searchQuery, stations, setStations, handleSearch } =
    useStationSearch(initialStations)

  // Keep internal filtering hook active (no visible filter UI)
  useStationFilters(setStations, setIsSearching)

  const { displayedStations, handleLoadMore, hasMore } =
    useStationPagination(stations)

  const handlePlayStation = (station: Station) => {
    setCurrentStation(station)
    if (audioRef.current) {
      audioRef.current.src = station.streamUrl
      audioRef.current.load()
      audioRef.current.play().catch(err => console.error("Error playing:", err))
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hidden audio element for radio streaming */}
      <audio ref={audioRef} />

      <StationSearchBar
        searchQuery={searchQuery}
        isSearching={isSearching}
        onSearchChange={handleSearch}
        resultsCount={stations.length}
      />

      {/* Music Player - 100px spacing above, 80px spacing below */}
      <div className="mt-[100px] mb-[80px] flex justify-center">
        <div className="w-full max-w-md">
          <Speaker currentStation={currentStation} audioRef={audioRef} />
        </div>
      </div>

      <StationList stations={displayedStations} onPlay={handlePlayStation} />

      <LoadMoreButton hasMore={hasMore} onLoadMore={handleLoadMore} />
    </div>
  )
}
