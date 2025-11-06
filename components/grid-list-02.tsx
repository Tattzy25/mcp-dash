"use client"

import { StationCard } from "@/components/station-card"

const genres = [
  {
    name: "Rock Classics",
    description: "Epic guitar riffs and legendary rock anthems",
    date: "Popular Genre",
    imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop",
  },
  {
    name: "Jazz & Blues",
    description: "Smooth saxophone and soulful rhythms",
    date: "Timeless Genre",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&auto=format&fit=crop",
  },
  {
    name: "Electronic Beats",
    description: "Pulsing synths and driving basslines",
    date: "Trending Genre",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
  },
  {
    name: "Classical",
    description: "Orchestral masterpieces for focused work",
    date: "Classical Genre",
    imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop",
  },
  {
    name: "Hip Hop",
    description: "Fresh beats and lyrical excellence",
    date: "Urban Genre",
    imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&auto=format&fit=crop",
  },
];

export default function GridList02() {
  return (
    <div
      role="region"
      aria-label="Music genres carousel"
      className="flex flex-row gap-4 -mx-2 px-2 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory webkit-overflow-scrolling-touch scrollbar-none"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {genres.map((genre) => (
        <div key={genre.name} className="flex-shrink-0 snap-center">
          <StationCard
            title={genre.name}
            subtitle={genre.description}
            date={genre.date}
            imageUrl={genre.imageUrl}
          />
        </div>
      ))}
    </div>
  );
}
