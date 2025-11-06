"use client"

import { StationCard } from "@/components/station-card"
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
    <div className="grid grid-cols-3 gap-[10px]">
      {stations.map((station) => (
        <StationCard
          key={station.id}
          title={station.title}
          subtitle={station.description}
          date={station.subtitle}
          imageUrl={station.favicon || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop"}
          onPlay={() => onPlay(station)}
        />
      ))}
    </div>
  )
}
