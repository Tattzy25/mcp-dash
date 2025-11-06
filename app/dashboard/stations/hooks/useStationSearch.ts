import { useState } from "react"
import { searchStations } from "@/app/actions/radio-browser"
import { Station } from "../types/station"

export function useStationSearch(initialStations: Station[]) {
  const [searchQuery, setSearchQuery] = useState("")
  const [stations, setStations] = useState<Station[]>(initialStations)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setStations(initialStations)
      return
    }

    setIsSearching(true)
    try {
      const results = await searchStations(query)
      setStations(results)
    } catch (error) {
      console.error("Search failed:", error)
      const filtered = initialStations.filter(
        (station) =>
          station.title.toLowerCase().includes(query.toLowerCase()) ||
          station.subtitle.toLowerCase().includes(query.toLowerCase())
      )
      setStations(filtered)
    } finally {
      setIsSearching(false)
    }
  }

  return {
    searchQuery,
    stations,
    setStations,
    isSearching,
    handleSearch,
  }
}
