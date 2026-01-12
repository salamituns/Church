import type {
  Pastor,
  Ministry,
  Event,
  Sermon,
  Testimonial,
  Page,
} from "./types"

// Import JSON data files
import pastorsData from "./data/pastors.json"
import ministriesData from "./data/ministries.json"
import eventsData from "./data/events.json"
import sermonsData from "./data/sermons.json"
import testimonialsData from "./data/testimonials.json"

/**
 * CMS Client Interface
 * 
 * This client reads content from JSON files stored in lib/cms/data/.
 * 
 * To update content:
 * 1. Edit the JSON files in lib/cms/data/
 * 2. Commit and deploy (or restart dev server)
 * 
 * Future: Can be easily swapped for a headless CMS (Contentful/Sanity/Strapi)
 * by replacing the file imports with API calls.
 */

// Helper function to convert date strings to Date objects
function parseDates<T extends { date?: string }>(items: T[]): (Omit<T, 'date'> & { date: Date })[] {
  return items.map((item) => ({
    ...item,
    date: item.date ? new Date(item.date) : new Date(),
  })) as (Omit<T, 'date'> & { date: Date })[]
}

class CMSClient {
  async getPastors(): Promise<Pastor[]> {
    return pastorsData as Pastor[]
  }

  async getPastor(id: string): Promise<Pastor | null> {
    const pastors = await this.getPastors()
    return pastors.find((p) => p.id === id) || null
  }

  async getMinistries(): Promise<Ministry[]> {
    return ministriesData as Ministry[]
  }

  async getMinistry(slug: string): Promise<Ministry | null> {
    const ministries = await this.getMinistries()
    return ministries.find((m) => m.slug === slug) || null
  }

  async getEvents(limit?: number): Promise<Event[]> {
    const events = parseDates(eventsData as Array<Omit<Event, 'date'> & { date: string }>)
    return limit ? events.slice(0, limit) : events
  }

  async getEvent(slug: string): Promise<Event | null> {
    const events = await this.getEvents()
    return events.find((e) => e.slug === slug) || null
  }

  async getSermons(limit?: number): Promise<Sermon[]> {
    const sermons = parseDates(sermonsData as Array<Omit<Sermon, 'date'> & { date: string }>)
    return limit ? sermons.slice(0, limit) : sermons
  }

  async getSermon(slug: string): Promise<Sermon | null> {
    const sermons = await this.getSermons()
    return sermons.find((s) => s.slug === slug) || null
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return testimonialsData as Testimonial[]
  }

  async getPage(slug: string): Promise<Page | null> {
    // Pages are not currently stored in JSON files
    // Can be added later if needed
    return null
  }
}

export const cmsClient = new CMSClient()

