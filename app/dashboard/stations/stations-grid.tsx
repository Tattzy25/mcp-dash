"use client"

import { useState } from "react"
import { Station } from "./types/station"
import { StationSearchBar } from "./components/StationSearchBar"
import GridList02 from "@/components/grid-list-02"
import { StationAudioPlayer } from "./components/StationAudioPlayer"
import { StationList } from "./components/StationList"
import { LoadMoreButton } from "./components/LoadMoreButton"
import { useStationSearch } from "./hooks/useStationSearch"
import { useStationFilters } from "./hooks/useStationFilters"
import { useStationPagination } from "./hooks/useStationPagination"

interface StationsGridProps {
  initialStations: Station[]
}

export function StationsGrid({ initialStations }: StationsGridProps) {
  const [isSearching, setIsSearching] = useState(false)

  const { searchQuery, stations, setStations, handleSearch } =
    useStationSearch(initialStations)

  // Keep internal filtering hook active (no visible filter UI)
  useStationFilters(setStations, setIsSearching)

  const { displayedStations, handleLoadMore, hasMore } =
    useStationPagination(stations)

  const handlePlayStation = (station: Station) => {
    console.log("Playing station:", station.title, station.streamUrl)
    // TODO: Implement audio playback
  }

  return (
    <div className="flex flex-col gap-8">
      <StationSearchBar
        searchQuery={searchQuery}
        isSearching={isSearching}
        onSearchChange={handleSearch}
        resultsCount={stations.length}
      />

      {/* Filters strip below search bar with exactly 50px spacing */}
      <div className="mt-[50px]">
        <GridList02 />
      </div>

      <StationAudioPlayer stationsCount={stations.length} />

      <StationList stations={displayedStations} onPlay={handlePlayStation} />

      <LoadMoreButton hasMore={hasMore} onLoadMore={handleLoadMore} />
    </div>
  )
}
