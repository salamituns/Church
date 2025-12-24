"use client"

import { Play, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SermonActionsProps {
  videoUrl?: string
}

export function SermonActions({ videoUrl }: SermonActionsProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row">
      {videoUrl && (
        <Button asChild size="lg" className="flex-1">
          <a href={videoUrl} target="_blank" rel="noopener noreferrer">
            <Play className="mr-2 h-4 w-4" />
            Watch Video
          </a>
        </Button>
      )}
      <Button 
        size="lg" 
        variant="outline" 
        className="flex-1"
        onClick={() => {
          window.open("https://open.spotify.com/show/37G6a2sMTd37GtARDJXQZt?si=yWhua7o3RQmCoGJ5zTzsTQ", "_blank", "noopener,noreferrer")
        }}
      >
        <Headphones className="mr-2 h-4 w-4" />
        Listen
      </Button>
    </div>
  )
}

