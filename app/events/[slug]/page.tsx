import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { getEvent, getEvents } from "@/lib/cms/queries"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, ExternalLink, ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const events = await getEvents()
  return events.map((event) => ({
    slug: event.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return {
      title: "Event Not Found",
    }
  }

  return {
    title: `${event.title} | RCCG Shiloh Mega Parish`,
    description: event.description,
  }
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  // Get other events for related events section
  const allEvents = await getEvents()
  const relatedEvents = allEvents
    .filter((e) => e.slug !== slug && e.image)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3)

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/events">
              <ArrowLeft className="h-4 w-4" />
              Back to Activities
            </Link>
          </Button>
        </div>

        {event.image && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
            <Image
              src={event.image.url}
              alt={event.image.alt || event.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        <h1 className="mb-3 text-3xl font-bold md:text-4xl">{event.title}</h1>
        <p className="mb-6 text-base text-muted-foreground md:text-lg">{event.description}</p>

        <div className="mb-8 grid gap-3 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Date</p>
                  <p className="text-sm md:text-base">{format(event.date, "EEEE, MMMM d, yyyy")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {event.time && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Time</p>
                    <p className="text-sm md:text-base">{event.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {event.location && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Location</p>
                    <p className="text-sm md:text-base">{event.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {event.content && (
          <div
            className="prose prose-lg mb-8 max-w-none prose-headings:font-semibold prose-h3:text-lg prose-ul:list-none prose-li:marker:hidden"
            dangerouslySetInnerHTML={{ __html: event.content }}
          />
        )}

        {event.registrationRequired && event.registrationUrl && (
          <Button asChild size="lg" className="w-full md:w-auto">
            <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
              Register Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}

        {/* Related Events Section */}
        {relatedEvents.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Other Activities</h2>
                <p className="text-muted-foreground">Explore more upcoming events</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/events">
                  View All Activities
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedEvents.map((relatedEvent) => (
                <Link key={relatedEvent.slug} href={`/events/${relatedEvent.slug}`}>
                  <Card className="group h-full transition-all hover:shadow-lg">
                    {relatedEvent.image && (
                      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={relatedEvent.image.url}
                          alt={relatedEvent.image.alt || relatedEvent.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{format(relatedEvent.date, "MMM d, yyyy")}</span>
                      </div>
                      <h3 className="mb-2 font-semibold group-hover:text-primary transition-colors">
                        {relatedEvent.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {relatedEvent.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

