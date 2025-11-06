"use client"

import { useState } from "react"
import { Station } from "./types/station"
import { StationSearchBar } from "./components/StationSearchBar"
import { StationFilters } from "./components/StationFilters"
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

  const {
    selectedGenre,
    showFilters,
    setSelectedGenre,
    setShowFilters,
  } = useStationFilters(setStations, setIsSearching)

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

      <StationFilters
        showFilters={showFilters}
        selectedGenre={selectedGenre}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onGenreChange={setSelectedGenre}
      />

      <StationAudioPlayer stationsCount={stations.length} />

      <StationList stations={displayedStations} onPlay={handlePlayStation} />

      <LoadMoreButton hasMore={hasMore} onLoadMore={handleLoadMore} />
    </div>
  )
}
