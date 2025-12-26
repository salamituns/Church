"use client"

import { useState } from "react"
import { EventCalendar } from "./EventCalendar"
import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/cms/types"

interface EventCategoriesProps {
  events: Event[]
}

type EventFilter = "all" | "upcoming" | "completed"

const filters: { value: EventFilter; label: string }[] = [
  { value: "all", label: "All Events" },
  { value: "upcoming", label: "Upcoming Events" },
  { value: "completed", label: "Recently Completed" },
]

export function EventCategories({ events }: EventCategoriesProps) {
  const [selectedFilter, setSelectedFilter] = useState<EventFilter>("all")
  const now = new Date()

  // Separate events into past and upcoming
  const pastEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date)
      eventDate.setHours(23, 59, 59, 999)
      return eventDate < now
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime()) // Most recent first

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate >= now
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime()) // Soonest first

  // Filter events based on selected filter
  const filteredEvents =
    selectedFilter === "all"
      ? events.sort((a, b) => {
          // Show upcoming first, then past
          const aIsUpcoming = new Date(a.date) >= now
          const bIsUpcoming = new Date(b.date) >= now
          if (aIsUpcoming && !bIsUpcoming) return -1
          if (!aIsUpcoming && bIsUpcoming) return 1
          // Within same category, sort by date
          return aIsUpcoming
            ? a.date.getTime() - b.date.getTime()
            : b.date.getTime() - a.date.getTime()
        })
      : selectedFilter === "upcoming"
        ? upcomingEvents
        : pastEvents

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedFilter === filter.value ? "default" : "outline"}
            onClick={() => setSelectedFilter(filter.value)}
            className="capitalize"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {selectedFilter === "all" ? (
        <div className="space-y-12">
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Upcoming Events</h2>
              <EventCalendar events={upcomingEvents} showAll />
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h2 className="mb-6 text-2xl font-bold">Recently Completed</h2>
              <EventCalendar events={pastEvents} showAll />
            </div>
          )}
        </div>
      ) : (
        <EventCalendar events={filteredEvents} showAll />
      )}
    </div>
  )
}

