'use server'

import dns from 'dns/promises'

interface RadioStation {
  stationuuid: string
  name: string
  url: string
  url_resolved: string
  homepage: string
  favicon: string
  tags: string
  countrycode: string
  state: string
  language: string
  languagecodes: string
  votes: number
  codec: string
  bitrate: number
  hls: number
  lastcheckok: number
  lastchecktime: string
  lastchecktime_iso8601: string
  clicktimestamp: string
  clicktimestamp_iso8601: string
  clickcount: number
  clicktrend: number
  ssl_error: number
  geo_lat: number | null
  geo_long: number | null
  has_extended_info: boolean
}

interface TransformedStation {
  id: string
  title: string
  subtitle: string
  description: string
  features: string[]
  stationuuid: string
  streamUrl: string
  favicon: string
}

interface SearchFilters {
  tag?: string
  tagExact?: boolean
  countrycode?: string
  language?: string
  codec?: string
  bitrateMin?: number
  bitrateMax?: number
  order?: 'clickcount' | 'votes' | 'bitrate' | 'name' | 'random'
  reverse?: boolean
  limit?: number
  offset?: number
  hidebroken?: boolean
}

interface CountryInfo {
  name: string
  stationcount: number
}

interface TagInfo {
  name: string
  stationcount: number
}

interface LanguageInfo {
  name: string
  iso_639: string | null
  stationcount: number
}

/**
 * Get Radio Browser servers via DNS SRV lookup
 */
async function getRadioBrowserServers(): Promise<string[]> {
  const records = await dns.resolveSrv('_api._tcp.radio-browser.info')
  const servers = records
    .sort((a, b) => a.priority - b.priority)
    .map((record) => `https://${record.name}`)
  return servers.sort(() => Math.random() - 0.5)
}

/**
 * Fetch from Radio Browser API
 */
async function fetchFromAPI<T>(path: string): Promise<T> {
  const servers = await getRadioBrowserServers()
  
  for (const server of servers) {
    try {
      const response = await fetch(`${server}${path}`, {
        headers: {
          'User-Agent': 'Bridgit AI/1.0',
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json() as T
    } catch (error) {
      console.error(`Failed ${server}:`, error)
      continue
    }
  }

  throw new Error('All servers failed')
}

/**
 * Build query string from filters
 */
function buildQuery(filters: SearchFilters): string {
  const params = new URLSearchParams()

  if (filters.tag) params.append('tag', filters.tag)
  if (filters.tagExact) params.append('tagExact', 'true')
  if (filters.countrycode) params.append('countrycode', filters.countrycode)
  if (filters.language) params.append('language', filters.language)
  if (filters.codec) params.append('codec', filters.codec)
  if (filters.bitrateMin !== undefined) params.append('bitrateMin', filters.bitrateMin.toString())
  if (filters.bitrateMax !== undefined) params.append('bitrateMax', filters.bitrateMax.toString())

  params.append('order', filters.order || 'clickcount')
  params.append('reverse', filters.reverse !== false ? 'true' : 'false')
  params.append('limit', (filters.limit || 100).toString())
  params.append('offset', (filters.offset || 0).toString())
  params.append('hidebroken', filters.hidebroken !== false ? 'true' : 'false')

  return params.toString()
}

/**
 * Transform station to display format
 */
function transformStation(station: RadioStation): TransformedStation {
  return {
    id: station.stationuuid,
    title: station.name,
    subtitle: station.tags.split(',').slice(0, 3).join(', ') || 'Radio',
    description: station.homepage || `${station.countrycode} • ${station.language}`,
    features: [
      `${station.codec || 'Unknown'} ${station.bitrate ? station.bitrate + ' kbps' : ''}`.trim(),
      `${station.clickcount.toLocaleString()} clicks`,
      `${station.votes} votes`,
      station.countrycode || 'Unknown',
    ].filter(Boolean),
    stationuuid: station.stationuuid,
    streamUrl: station.url_resolved || station.url,
    favicon: station.favicon || '',
  }
}

/**
 * Advanced search with filters
 */
export async function searchStationsAdvanced(
  filters: SearchFilters = {}
): Promise<TransformedStation[]> {
  if (!filters.bitrateMin) {
    filters.bitrateMin = 120
  }

  const query = buildQuery(filters)
  const stations = await fetchFromAPI<RadioStation[]>(`/json/stations/search?${query}`)

  return stations
    .filter((station) => station.lastcheckok === 1 && station.bitrate >= 120)
    .map(transformStation)
}

/**
 * Get countries
 */
export async function getCountries(): Promise<CountryInfo[]> {
  const countries = await fetchFromAPI<CountryInfo[]>(
    '/json/countrycodes?order=stationcount&reverse=true&limit=500'
  )
  return countries.filter((c) => c.stationcount > 0)
}

/**
 * Get tags/genres
 */
export async function getTags(limit: number = 50): Promise<TagInfo[]> {
  const tags = await fetchFromAPI<TagInfo[]>(
    `/json/tags?order=stationcount&reverse=true&limit=${limit}&hidebroken=true`
  )
  return tags.filter((t) => t.stationcount > 0)
}

/**
 * Get languages
 */
export async function getLanguages(limit: number = 50): Promise<LanguageInfo[]> {
  const languages = await fetchFromAPI<LanguageInfo[]>(
    `/json/languages?order=stationcount&reverse=true&limit=${limit}&hidebroken=true`
  )
  return languages.filter((l) => l.stationcount > 0)
}

/**
 * Search by name
 */
export async function searchStations(
  query: string,
  limit: number = 50
): Promise<TransformedStation[]> {
  const stations = await fetchFromAPI<RadioStation[]>(
    `/json/stations/search?name=${encodeURIComponent(query)}&bitrateMin=120&hidebroken=true&limit=${limit}&order=clickcount&reverse=true`
  )

  return stations
    .filter((station) => station.lastcheckok === 1 && station.bitrate >= 120)
    .map(transformStation)
}

/**
 * Track click
 */
export async function trackStationClick(
  stationuuid: string
): Promise<{ url: string; name: string; ok: boolean; message: string }> {
  return await fetchFromAPI<{ url: string; name: string; ok: boolean; message: string }>(
    `/json/url/${stationuuid}`
  )
}
