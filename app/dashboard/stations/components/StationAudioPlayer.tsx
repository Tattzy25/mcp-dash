"use client"

import { IconPlayerPlayFilled } from "@tabler/icons-react"
import AiVoice from "@/components/kokonutui/ai-voice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StationAudioPlayerProps {
  stationsCount: number
}

export function StationAudioPlayer({ stationsCount }: StationAudioPlayerProps) {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-12">
      {/* AI Voice - Left Side, hide on mobile for better UX */}
      <div className="hidden lg:block flex-shrink-0">
        <AiVoice />
      </div>

      {/* Audio Player - Full width on mobile, right side on desktop */}
      <Card className="w-full lg:flex-1 lg:max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Audio Player</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {stationsCount} radio stations loaded
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              size="lg"
              className="flex-1 sm:flex-initial"
            >
              <IconPlayerPlayFilled className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Play
            </Button>
            <Button variant="outline" size="lg" className="flex-1 sm:flex-initial">
              Pause
            </Button>
            <Button variant="outline" size="lg" className="flex-1 sm:flex-initial">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
