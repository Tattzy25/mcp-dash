import { searchStationsAdvanced } from "@/app/actions/radio-browser"
import { StationsGrid } from "./stations-grid"
import ShimmerText from "@/components/kokonutui/shimmer-text"

export default async function StationsPage() {
  // Fetch exactly 10 high-quality radio stations with bitrate >= 120 kbps
  const stations = await searchStationsAdvanced({
    bitrateMin: 120, // Only stations with 128+ kbps
    limit: 10, // Exactly 10 stations
    order: 'clickcount', // Sort by popularity
    reverse: true, // Highest first
    hidebroken: true, // No broken stations
  })

  return (
    <div className="flex flex-1 flex-col px-1 lg:px-1 pb-4 pt-0">
      {/* Header Section - Left aligned with shimmer */}
      <div className="flex flex-col gap-2 w-full mt-0 pt-0">
        <ShimmerText 
          text="Hit Play. Watch Data Shake Its Assets." 
          className="text-7xl sm:text-8xl md:text-9xl lg:text-[140px] xl:text-[160px] 2xl:text-[180px] font-bold tracking-tight leading-none text-left"
        />
      </div>

      {/* Subheadline - Center aligned, one row */}
      <div className="flex justify-center w-full mb-8">
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-center">
          From raw numbers to rhythmic nonsense, courtesy of Bridgit AI
        </p>
      </div>

      {/* 100px spacing */}
      <div className="h-[100px]" />

      {/* Stations Grid with Search - Center aligned */}
      <div className="flex flex-col items-center w-full">
        <StationsGrid initialStations={stations} />
      </div>
    </div>
  )
}
