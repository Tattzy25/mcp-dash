"use client"

import { Button } from "@/components/ui/button"

interface LoadMoreButtonProps {
  hasMore: boolean
  onLoadMore: () => void
}

export function LoadMoreButton({ hasMore, onLoadMore }: LoadMoreButtonProps) {
  if (!hasMore) return null

  return (
    <div className="flex justify-center mt-6">
      <Button
        variant="outline"
        size="lg"
        onClick={onLoadMore}
        className="w-full sm:w-auto"
      >
        Load More Stations
      </Button>
    </div>
  )
}
