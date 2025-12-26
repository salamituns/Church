import { EventCategories } from "@/components/sections/EventCategories"
import { getEvents } from "@/lib/cms/queries"

export const metadata = {
  title: "Events | RCCG Shiloh Mega Parish",
  description: "Join us for upcoming events, services, and special gatherings.",
}

export default async function EventsPage() {
  const events = await getEvents()

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

