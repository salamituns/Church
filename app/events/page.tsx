import { EventCategories } from "@/components/sections/EventCategories"
import { getEvents } from "@/lib/cms/queries"
import { generateRecurringEvents } from "@/lib/utils/serviceTimes"

export const metadata = {
  title: "Events | RCCG Shiloh Mega Parish",
  description: "Join us for upcoming events, services, and special gatherings.",
}

export default async function EventsPage() {
  const staticEvents = await getEvents()
  const recurringEvents = generateRecurringEvents(6) // Generate 6 months ahead for activities page
  
  // Merge events and deduplicate by title
  // For recurring event titles (Bible Study Series, Faith Clinic, Youth Ministry, Thanksgiving Service),
  // prefer recurring events over static ones to ensure we always show the next upcoming occurrence
  const recurringEventTitles = new Set(recurringEvents.map(e => e.title))
  
  // Filter out static events that have the same title as recurring events
  const filteredStaticEvents = staticEvents.filter(
    (staticEvent) => !recurringEventTitles.has(staticEvent.title)
  )
  
  // Merge: static events (excluding recurring ones) + all recurring events
  const events = [...filteredStaticEvents, ...recurringEvents]

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Activities</h1>
        <p className="text-lg text-muted-foreground">
          Join us for these special gatherings and activities
        </p>
      </div>

      <EventCategories events={events} />
    </div>
  )
}

