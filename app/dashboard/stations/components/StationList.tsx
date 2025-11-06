"use client"

import CardFlip from "@/components/kokonutui/card-flip"
import { Station } from "../types/station"

interface StationListProps {
  stations: Station[]
  onPlay: (station: Station) => void
}

export function StationList({ stations, onPlay }: StationListProps) {
  if (stations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-base sm:text-lg text-muted-foreground">
          No stations found. Try a different search.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6">
      {stations.map((station) => (
        <CardFlip
          key={station.id}
          title={station.title}
          subtitle={station.subtitle}
          description={station.description}
          features={station.features}
          showPlayButton={true}
          onPlay={() => onPlay(station)}
        />
      ))}
    </div>
  )
}
