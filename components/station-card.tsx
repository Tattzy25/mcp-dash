"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react"
import { useState } from "react"

interface StationCardProps {
  title: string
  subtitle: string
  date: string
  imageUrl: string
  onPlay?: () => void
  isPlaying?: boolean
}

export function StationCard({ 
  title, 
  subtitle, 
  date, 
  imageUrl,
  onPlay,
  isPlaying = false
}: StationCardProps) {
  const [localPlaying, setLocalPlaying] = useState(false)
  const playing = isPlaying || localPlaying

  const handlePlayClick = () => {
    setLocalPlaying(!localPlaying)
    onPlay?.()
  }

  return (
    <Card className="relative w-[300px] h-[100px] overflow-visible rounded-2xl shadow-[0px_14px_80px_rgba(34,35,58,0.2)] dark:shadow-[0px_14px_80px_rgba(0,0,0,0.5)] flex flex-row items-center p-[5px] bg-background">
      {/* Card Media */}
      <div className="relative w-[90px] h-[90px] flex-shrink-0 rounded-2xl bg-white dark:bg-gray-900 overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-50 dark:opacity-70 rounded-2xl" />
        
        {/* Play/Pause Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full w-16 h-16 shadow-lg bg-white/90 hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
            onClick={handlePlayClick}
          >
            {playing ? (
              <IconPlayerPause className="w-8 h-8" />
            ) : (
              <IconPlayerPlay className="w-8 h-8" />
            )}
          </Button>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-[5px] flex-1 flex flex-col justify-center">
        <h3 className="text-sm font-bold mb-1 font-sans line-clamp-1">
          {title}
        </h3>
        <p className="text-xs opacity-80 line-clamp-1">
          {subtitle}
        </p>
        <Button 
          size="sm"
          className="rounded-full px-3 py-1 mt-1 text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white"
          onClick={handlePlayClick}
        >
          {playing ? "Pause" : "Play"}
        </Button>
      </CardContent>
    </Card>
  )
}
