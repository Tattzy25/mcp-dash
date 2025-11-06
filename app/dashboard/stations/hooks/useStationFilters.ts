import { useState, useEffect } from "react"
import {
  searchStationsAdvanced,
  getCountries,
  getTags,
  getLanguages,
} from "@/app/actions/radio-browser"
import { Station } from "../types/station"

interface FilterOption {
  name: string
  stationcount: number
}

export function useStationFilters(
  setStations: (stations: Station[]) => void,
  setIsSearching: (isSearching: boolean) => void
) {
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const [countries, setCountries] = useState<FilterOption[]>([])
  const [genres, setGenres] = useState<FilterOption[]>([])
  const [languages, setLanguages] = useState<FilterOption[]>([])

  // Load filter options
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [countriesData, genresData, languagesData] = await Promise.all([
          getCountries(),
          getTags(100),
          getLanguages(50),
        ])
        setCountries(countriesData)
        setGenres(genresData)
        setLanguages(languagesData)
      } catch (error) {
        console.error("Failed to load filters:", error)
      }
    }
    loadFilters()
  }, [])

  // Apply filters whenever they change
  useEffect(() => {
    const applyFilters = async () => {
      setIsSearching(true)
      try {
        const results = await searchStationsAdvanced({
          tag: selectedGenre !== "all" ? selectedGenre : undefined,
          countrycode: selectedCountry !== "all" ? selectedCountry : undefined,
          language: selectedLanguage !== "all" ? selectedLanguage : undefined,
          bitrateMin: 120,
          limit: 100,
          order: "clickcount",
          reverse: true,
        })
        setStations(results)
      } catch (error) {
        console.error("Filter failed:", error)
      } finally {
        setIsSearching(false)
      }
    }

    if (
      selectedCountry !== "all" ||
      selectedGenre !== "all" ||
      selectedLanguage !== "all"
    ) {
      applyFilters()
    }
  }, [selectedCountry, selectedGenre, selectedLanguage, setStations, setIsSearching])

  return {
    selectedCountry,
    selectedGenre,
    selectedLanguage,
    showFilters,
    countries,
    genres,
    languages,
    setSelectedCountry,
    setSelectedGenre,
    setSelectedLanguage,
    setShowFilters,
  }
}
