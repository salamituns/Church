import { HeroSection } from "@/components/sections/HeroSection"
import { ServiceScheduleSection } from "@/components/sections/ServiceScheduleSection"
import { LatestSermon } from "@/components/sections/LatestSermon"
import { FeaturedEventsCarousel } from "@/components/sections/FeaturedEventsCarousel"
import { PastorCard } from "@/components/sections/PastorCard"
import { MinistryGrid } from "@/components/sections/MinistryGrid"
import { TestimonialSection } from "@/components/sections/TestimonialSection"
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll"
import { StaggerChildren } from "@/components/animations/StaggerChildren"
import { FadeInItem } from "@/components/animations/FadeInItem"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight, Heart } from "lucide-react"
import { getPastors, getMinistries, getEvents, getTestimonials, getLatestSermon } from "@/lib/cms/queries"

export default async function HomePage() {
  const [pastors, ministries, events, testimonials, latestSermon] = await Promise.all([
    getPastors(),
    getMinistries(),
    getEvents(10),
    getTestimonials(),
    getLatestSermon(),
  ])

  // Filter events with images, exclude Christmas Carol Night from carousel
  const featuredEvents = events
    .filter((e) => e.image && e.slug !== "christmas-carol-night")
    .slice(0, 6)

  return (
    <div className="flex flex-col">
      <HeroSection />

      <ServiceScheduleSection />

      {latestSermon && <LatestSermon sermon={latestSermon} />}

      {featuredEvents.length > 0 && (
        <section className="py-12 sm:py-14 md:py-16">
          <FeaturedEventsCarousel events={featuredEvents} />
        </section>
      )}

      <section className="container py-12 sm:py-14 md:py-16 px-4 sm:px-6">
        <FadeInOnScroll>
          <div className="mb-8 sm:mb-10 md:mb-12 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Meet the Pastors</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Our leadership team dedicated to serving you
            </p>
          </div>
        </FadeInOnScroll>
        <StaggerChildren className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2">
          {pastors.map((pastor) => (
            <FadeInItem key={pastor.id}>
              <PastorCard
                name={pastor.name}
                title={pastor.title}
                image={pastor.image.url}
                bio={pastor.bio}
              />
            </FadeInItem>
          ))}
        </StaggerChildren>
      </section>

      <section className="bg-muted/30 py-12 sm:py-14 md:py-16">
        <div className="container px-4 sm:px-6">
          <FadeInOnScroll>
            <div className="mb-8 sm:mb-10 md:mb-12 text-center">
              <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Our Ministries</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover ways to get involved and grow in faith
              </p>
            </div>
          </FadeInOnScroll>
          <MinistryGrid ministries={ministries} />
        </div>
      </section>

      {/* Donate Call-to-Action Section */}
      <section className="py-12 sm:py-14 md:py-16 bg-primary/5">
        <div className="container px-4 sm:px-6">
          <FadeInOnScroll>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Support Our Mission</h2>
              <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground">
                Your generous giving helps us continue building people and fulfilling destinies in our community and beyond.
              </p>
              <Button asChild size="lg" className="transition-all hover:scale-105 text-sm sm:text-base">
                <Link href="/give">
                  <Heart className="mr-2 h-4 w-4" />
                  Donate Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      <section className="relative py-12 sm:py-14 md:py-16 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&h=800&fit=crop&q=80"
            alt="Church events and community"
            fill
            className="object-cover"
            quality={90}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        </div>
        
        <div className="container relative z-10 px-4 sm:px-6">
          <FadeInOnScroll>
            <div className="text-center">
              <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold text-white">View All Events</h2>
              <p className="mb-6 sm:mb-8 text-sm sm:text-base text-white/90">
                See our full calendar of upcoming events and activities
              </p>
              <Button asChild size="lg" className="transition-all hover:scale-105 text-sm sm:text-base touch-manipulation bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/events">
                  <Calendar className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  View Events Calendar
                  <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {testimonials.length > 0 && <TestimonialSection testimonials={testimonials} />}
    </div>
  )
}

