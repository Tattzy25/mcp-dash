import { useState, useEffect } from "react"
import { Station } from "../types/station"

export function useStationPagination(stations: Station[]) {
  const [displayedStations, setDisplayedStations] = useState<Station[]>([])

  useEffect(() => {
    setDisplayedStations(stations.slice(0, 10))
  }, [stations])

  const handleLoadMore = () => {
    const currentLength = displayedStations.length
    const nextStations = stations.slice(0, currentLength + 10)
    setDisplayedStations(nextStations)
  }

  const hasMore = displayedStations.length < stations.length

  return {
    displayedStations,
    handleLoadMore,
    hasMore,
  }
}
