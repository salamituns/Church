"use client"

import Image from "next/image"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { Play, Headphones, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll"
import type { Sermon } from "@/lib/cms/types"

interface LatestSermonProps {
  sermon: Sermon
}

export function LatestSermon({ sermon }: LatestSermonProps) {
  return (
    <section className="bg-gradient-to-br from-amber-50/50 via-stone-50 to-amber-50/30 py-12 sm:py-14 md:py-16">
      <div className="container px-4 sm:px-6">
        <FadeInOnScroll>
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Latest Message</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Watch or listen to our most recent sermon
            </p>
          </div>
        </FadeInOnScroll>

        <FadeInOnScroll delay={0.2}>
          <div className="mx-auto max-w-5xl">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-0 bg-white shadow-xl">
            <div className="grid md:grid-cols-2">
              {sermon.image && (
                <div className="relative h-48 sm:h-56 md:h-64 w-full md:h-full">
                  <Image
                    src={sermon.image.url}
                    alt={sermon.image.alt || sermon.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  {(sermon.videoUrl || sermon.audioUrl) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90">
                        <Play className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <CardContent className="flex flex-col justify-center p-5 sm:p-6 md:p-8 w-full md:max-w-[530px]">
                {sermon.series && (
                  <p className="mb-2 text-xs sm:text-sm font-semibold text-primary">{sermon.series}</p>
                )}
                <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold leading-tight">{sermon.title}</h3>
                <p className="mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base text-muted-foreground line-clamp-3 sm:line-clamp-none">{sermon.description}</p>

                <div className="mb-4 sm:mb-5 md:mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{format(sermon.date, "MMMM d, yyyy")}</span>
                  </div>
                  {sermon.speaker && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{sermon.speaker}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2.5 sm:gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                  {sermon.videoUrl && (
                    <Button asChild size="lg" className="w-full sm:w-auto sm:flex-1 text-sm sm:text-base touch-manipulation justify-center">
                      <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Watch Video
                      </a>
                    </Button>
                  )}
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto sm:flex-1 text-sm sm:text-base touch-manipulation justify-center"
                    onClick={() => {
                      window.open("https://open.spotify.com/show/37G6a2sMTd37GtARDJXQZt?si=yWhua7o3RQmCoGJ5zTzsTQ", "_blank", "noopener,noreferrer")
                    }}
                  >
                    <Headphones className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Listen
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
            </motion.div>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  )
}

