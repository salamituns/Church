import type { Event } from "@/lib/cms/types"
import { DEFAULT_EVENT_HOUR, DAYS_TO_CHECK_FOR_SERVICES, END_OF_DAY_HOUR, END_OF_DAY_MINUTE, END_OF_DAY_SECOND, END_OF_DAY_MILLISECOND } from "@/lib/constants"

/**
 * Parses a time string into hours and minutes with robust handling of various formats.
 * Supports: "10:00 AM", "10am", "10:00am", "10:00 PM", "10pm", etc.
 * @param timeStr - Time string to parse
 * @returns Object with hours (24-hour format) and minutes, or null if parsing fails
 */
function parseTimeString(timeStr: string): { hours: number; minutes: number } | null {
  if (!timeStr || typeof timeStr !== 'string') {
    return null
  }

  // Normalize: uppercase, remove extra spaces
  const normalized = timeStr.trim().toUpperCase().replace(/\s+/g, ' ')
  
  // Extract AM/PM
  const isPM = normalized.includes('PM')
  const isAM = normalized.includes('AM')
  
  // Remove AM/PM for parsing
  const timeWithoutPeriod = normalized.replace(/\s*(AM|PM)\s*/i, '')
  
  // Try to split by colon
  let hoursStr: string
  let minutesStr: string = '0'
  
  if (timeWithoutPeriod.includes(':')) {
    [hoursStr, minutesStr] = timeWithoutPeriod.split(':')
  } else {
    // No colon - assume format like "10am" or "10"
    hoursStr = timeWithoutPeriod
  }
  
  // Parse hours and minutes
  const hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)
  
  // Validate
  if (isNaN(hours) || hours < 1 || hours > 12) {
    return null
  }
  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    return null
  }
  
  // Convert to 24-hour format
  let hours24 = hours
  if (isPM && hours !== 12) {
    hours24 = hours + 12
  } else if (isAM && hours === 12) {
    hours24 = 0
  }
  
  return { hours: hours24, minutes }
}

/**
 * Parses an event's date and time into a Date object with the correct time set.
 * @param event - The event to parse
 * @param defaultHour - Default hour if no time is specified (default: 10 for 10:00 AM)
 * @returns Date object with the event's date and time set
 */
export function parseEventDateTime(event: Event, defaultHour: number = DEFAULT_EVENT_HOUR): Date {
  const eventDate = new Date(event.date)
  
  if (event.time) {
    const parsed = parseTimeString(event.time)
    if (parsed) {
      eventDate.setHours(parsed.hours, parsed.minutes, 0, 0)
    } else {
      // Fallback to default if parsing fails
      eventDate.setHours(defaultHour, 0, 0, 0)
    }
  } else {
    eventDate.setHours(defaultHour, 0, 0, 0)
  }
  
  return eventDate
}

export interface ServiceTime {
  name: string
  day: "sunday" | "wednesday" | "first-sunday" | "third-sunday"
  time: string
  description?: string
  recurring?: "weekly" | "monthly-first" | "monthly-third" | "alternating-weekly"
  alternateWith?: string // Name of the service this alternates with
}

export const serviceTimes: ServiceTime[] = [
  {
    name: "Sunday Service",
    day: "sunday",
    time: "9:20 AM",
    description: "Main worship service",
    recurring: "weekly",
  },
  {
    name: "Digging Deep / Faith Clinic",
    day: "wednesday",
    time: "7:00 PM",
    description: "Bible study and prayer",
    recurring: "weekly",
  },
  {
    name: "Digging Deep",
    day: "wednesday",
    time: "7:00 PM",
    description: "Deep dive into God's Word with our weekly Bible study sessions",
    recurring: "alternating-weekly",
    alternateWith: "Faith Clinic",
  },
  {
    name: "Faith Clinic",
    day: "wednesday",
    time: "7:00 PM",
    description: "A place for healing, restoration, and spiritual growth through prayer and the Word",
    recurring: "alternating-weekly",
    alternateWith: "Digging Deep",
  },
  {
    name: "Youth Ministry",
    day: "third-sunday",
    time: "9:20 AM",
    description: "Youth-focused service",
    recurring: "monthly-third",
  },
  {
    name: "Thanksgiving Service",
    day: "first-sunday",
    time: "9:20 AM",
    description: "Monthly thanksgiving celebration",
    recurring: "monthly-first",
  },
]

/**
 * Gets the next upcoming service or special event, whichever is sooner.
 * @param events - Optional array of special events to check against
 * @returns The next service/event with its date, or null if none found
 */
export function getNextService(events?: Event[]): { 
  service: ServiceTime | { name: string; time: string; description?: string }; 
  date: Date 
} | null {
  const now = new Date()
  const nextServices: Array<{ service: ServiceTime | { name: string; time: string; description?: string }; date: Date }> = []

  // Find next recurring services
  for (let i = 0; i < DAYS_TO_CHECK_FOR_SERVICES; i++) {
    const checkDate = new Date(now)
    checkDate.setDate(checkDate.getDate() + i)
    const checkDay = checkDate.getDay()

    for (const service of serviceTimes) {
      let matches = false

      if (service.day === "sunday" && checkDay === 0) {
        // Every Sunday - standard service
        if (service.recurring === "weekly") {
          matches = true
        }
      } else if (service.day === "wednesday" && checkDay === 3) {
        // Every Wednesday - Bible study
        if (service.recurring === "weekly") {
          matches = true
        }
      } else if (service.day === "first-sunday" && checkDay === 0) {
        // First Sunday of month - Thanksgiving Service
        const firstSunday = getFirstSundayOfMonth(checkDate)
        if (checkDate.getDate() === firstSunday.getDate() && 
            checkDate.getMonth() === firstSunday.getMonth()) {
          matches = true
        }
      } else if (service.day === "third-sunday" && checkDay === 0) {
        // Third Sunday of month - Youth Ministry
        const thirdSunday = getThirdSundayOfMonth(checkDate)
        if (checkDate.getDate() === thirdSunday.getDate() && 
            checkDate.getMonth() === thirdSunday.getMonth()) {
          matches = true
        }
      }

      if (matches) {
        const serviceDate = new Date(checkDate)
        const parsedTime = parseTimeString(service.time)
        if (parsedTime) {
          serviceDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0)
        } else {
          // Fallback if a service time string is malformed
          serviceDate.setHours(DEFAULT_EVENT_HOUR, 0, 0, 0)
        }

        // If it's today, check if the time has passed
        if (i === 0) {
          if (serviceDate > now) {
            nextServices.push({ service, date: serviceDate })
          }
        } else {
          nextServices.push({ service, date: serviceDate })
        }
      }
    }
  }

  // Check for upcoming special events
  if (events && events.length > 0) {
    const upcomingEvents = events
      .filter((event) => {
        const eventDate = parseEventDateTime(event)
        return eventDate > now
      })
      .map((event) => {
        const eventDate = parseEventDateTime(event)
        return {
          service: {
            name: event.title,
            time: event.time || "10:00 AM",
            description: event.description,
          },
          date: eventDate,
        }
      })

    nextServices.push(...upcomingEvents)
  }

  // Return the service/event that's coming up soonest
  if (nextServices.length === 0) {
    return null
  }

  nextServices.sort((a, b) => a.date.getTime() - b.date.getTime())
  return nextServices[0]
}

/**
 * Gets the first Sunday of the month for a given date
 */
function getFirstSundayOfMonth(date: Date): Date {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const dayOfWeek = firstDay.getDay()
  const firstSunday = new Date(firstDay)
  
  // Calculate days to add: if Sunday (0), add 0; otherwise add (7 - dayOfWeek)
  const daysToAdd = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  firstSunday.setDate(1 + daysToAdd)
  
  return firstSunday
}

/**
 * Gets the third Sunday of the month for a given date
 */
function getThirdSundayOfMonth(date: Date): Date {
  const firstSunday = getFirstSundayOfMonth(date)
  const thirdSunday = new Date(firstSunday)
  thirdSunday.setDate(firstSunday.getDate() + 14) // Add 2 weeks to get 3rd Sunday
  return thirdSunday
}

/**
 * Gets the next Wednesday from the given date
 * @param fromDate - Starting date to search from
 * @returns Next Wednesday date (at midnight), or null if not found
 */
function getNextWednesday(fromDate: Date): Date | null {
  const date = new Date(fromDate)
  const currentDay = date.getDay() // 0 = Sunday, 3 = Wednesday
  
  let daysUntilWednesday: number
  if (currentDay < 3) {
    // Sunday (0), Monday (1), Tuesday (2) -> next Wednesday
    daysUntilWednesday = 3 - currentDay
  } else if (currentDay === 3) {
    // Today is Wednesday -> check if we need this Wednesday or next
    const todayAtServiceTime = new Date(date)
    todayAtServiceTime.setHours(19, 0, 0, 0) // 7:00 PM
    if (todayAtServiceTime > fromDate) {
      // Service time hasn't passed today, use today
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }
    // Service time has passed, use next Wednesday
    daysUntilWednesday = 7
  } else {
    // Thursday (4), Friday (5), Saturday (6) -> next Wednesday
    daysUntilWednesday = 10 - currentDay
  }

  const nextWednesday = new Date(date)
  nextWednesday.setDate(date.getDate() + daysUntilWednesday)
  nextWednesday.setHours(0, 0, 0, 0) // Set to midnight for date comparison
  
  return nextWednesday
}

export function formatTimeRemaining(targetDate: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

/**
 * Generates the next upcoming occurrence of each recurring event type
 * @param monthsAhead - Maximum number of months ahead to search for next occurrence (default: 6)
 * @returns Array of Event objects - one per recurring service type (only the next occurrence)
 */
export function generateRecurringEvents(monthsAhead: number = 6): Event[] {
  const now = new Date()
  const events: Event[] = []
  const endDate = new Date(now)
  endDate.setMonth(endDate.getMonth() + monthsAhead)

  // Image mappings for recurring events
  const eventImages: Record<string, { url: string; alt: string }> = {
    "Youth Ministry": {
      url: "/images/youth_activities.avif",
      alt: "Youth Ministry Service",
    },
    "Thanksgiving Service": {
      url: "/images/thanksgiving_service.avif",
      alt: "Thanksgiving Service - Monthly celebration and worship",
    },
    "Digging Deep": {
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop&q=80",
      alt: "Bible Study Series - Digging Deep",
    },
    "Faith Clinic": {
      url: "/images/faith_clinic.avif",
      alt: "Faith Clinic",
    },
  }

  // Content mappings for recurring events
  const eventContent: Record<string, string> = {
    "Youth Ministry": "<div class=\"space-y-8\"><p class=\"text-lg leading-relaxed text-muted-foreground\">Empowering the next generation to live boldly for Christ. Through dynamic worship, relevant teaching, and authentic community, we help young people discover their purpose and make an impact.</p><div class=\"border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg\"><h3 class=\"text-lg font-semibold mb-3 text-primary\">Scripture</h3><p class=\"text-lg font-medium italic mb-2\">\"Let no man despise thy youth; but be thou an example of the believers...\"</p><p class=\"text-sm text-muted-foreground mb-3\">1 Timothy 4:12 (KJV)</p><p class=\"text-lg font-medium italic mb-2\">\"Remember now thy Creator in the days of thy youth...\"</p><p class=\"text-sm text-muted-foreground\">Ecclesiastes 12:1 (KJV)</p></div><div class=\"grid gap-6 md:grid-cols-2\"><div class=\"space-y-3\"><h3 class=\"font-semibold\">What We Offer</h3><ul class=\"space-y-1.5 text-sm text-muted-foreground\"><li>• Dynamic worship & praise</li><li>• Relevant Bible teaching</li><li>• Small groups & mentorship</li><li>• Outreach & service projects</li></ul></div><div class=\"space-y-3\"><h3 class=\"font-semibold\">Our Vision</h3><ul class=\"space-y-1.5 text-sm text-muted-foreground\"><li>• Equip with biblical foundation</li><li>• Discover God-given gifts</li><li>• Create safe, authentic space</li><li>• Empower as leaders & influencers</li></ul></div></div></div>",
    "Thanksgiving Service": "<div class=\"space-y-8\"><p class=\"text-lg leading-relaxed text-muted-foreground\">Join us for our monthly thanksgiving celebration as we express gratitude to God for His faithfulness, provision, and blessings in our lives and community.</p><div class=\"border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg\"><h3 class=\"text-lg font-semibold mb-3 text-primary\">Scripture</h3><p class=\"text-lg font-medium italic mb-2\">\"Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.\"</p><p class=\"text-sm text-muted-foreground mb-3\">Psalm 100:4 (KJV)</p><p class=\"text-lg font-medium italic mb-2\">\"In every thing give thanks: for this is the will of God in Christ Jesus concerning you.\"</p><p class=\"text-sm text-muted-foreground\">1 Thessalonians 5:18 (KJV)</p></div><div class=\"grid gap-6 md:grid-cols-2\"><div class=\"space-y-3\"><h3 class=\"font-semibold\">What to Expect</h3><ul class=\"space-y-1.5 text-sm text-muted-foreground\"><li>• Testimonies of God's faithfulness</li><li>• Special worship & praise</li><li>• Thanksgiving offerings</li><li>• Prayer & celebration</li></ul></div><div class=\"space-y-3\"><h3 class=\"font-semibold\">Why We Give Thanks</h3><p class=\"text-sm text-muted-foreground\">Gratitude transforms our perspective and opens our hearts to receive more of God's blessings. As we give thanks, we acknowledge His goodness and faithfulness in every season of life.</p></div></div></div>",
    "Digging Deep": "<div class=\"space-y-8\"><p class=\"text-lg leading-relaxed text-muted-foreground\">Join us for an in-depth exploration of Scripture. We help you understand God's Word, apply biblical principles to daily life, and grow in your relationship with Christ.</p><div class=\"border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg\"><h3 class=\"text-lg font-semibold mb-3 text-primary\">Scripture</h3><p class=\"text-lg font-medium italic mb-2\">\"Study to shew thyself approved unto God... rightly dividing the word of truth.\"</p><p class=\"text-sm text-muted-foreground mb-3\">2 Timothy 2:15 (KJV)</p><p class=\"text-lg font-medium italic mb-2\">\"Thy word is a lamp unto my feet, and a light unto my path.\"</p><p class=\"text-sm text-muted-foreground\">Psalm 119:105 (KJV)</p></div><div class=\"grid gap-6 md:grid-cols-2\"><div class=\"space-y-3\"><h3 class=\"font-semibold\">Study Format</h3><ul class=\"space-y-1.5 text-sm text-muted-foreground\"><li>• Verse-by-verse study</li><li>• Interactive discussions</li><li>• Practical application</li><li>• Prayer & reflection</li></ul></div><div class=\"space-y-3\"><h3 class=\"font-semibold\">Why It Matters</h3><ul class=\"space-y-1.5 text-sm text-muted-foreground\"><li>• Reveals God's will</li><li>• Provides wisdom & guidance</li><li>• Strengthens faith</li><li>• Transforms thinking (Romans 12:2)</li></ul></div></div></div>",
    "Faith Clinic": "<div class=\"space-y-8\"><p class=\"text-lg leading-relaxed text-muted-foreground\">A dedicated time for healing, restoration, and breakthrough. Through prayer, worship, and God's Word, we seek His intervention for physical, emotional, and spiritual healing.</p><div class=\"border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg\"><h3 class=\"text-lg font-semibold mb-3 text-primary\">Scripture</h3><p class=\"text-lg font-medium italic mb-2\">\"...with his stripes we are healed.\"</p><p class=\"text-sm text-muted-foreground mb-3\">Isaiah 53:5 (KJV)</p><p class=\"text-lg font-medium italic mb-2\">\"The prayer of faith shall save the sick, and the Lord shall raise him up.\"</p><p class=\"text-sm text-muted-foreground\">James 5:14-15 (KJV)</p></div><div class=\"grid gap-6 md:grid-cols-2\"><div class=\"space-y-3\"><h3 class=\"font-semibold\">Service Elements</h3><ul class=\"space-y-1.5 text-sm text-muted-foreground\"><li>• Intimate worship & prayer</li><li>• Teaching on faith & healing</li><li>• Corporate intercession</li><li>• Individual prayer & anointing</li></ul></div><div class=\"space-y-3\"><h3 class=\"font-semibold\">Our Belief</h3><ul class=\"space-y-1.5 text-sm text-muted-foreground\"><li>• God desires to heal (3 John 1:2)</li><li>• Power of prayer & faith (Mark 11:24)</li><li>• Jesus' authority over sickness (Matthew 8:17)</li><li>• Believe and receive (Mark 5:34)</li></ul></div></div></div>",
  }

  // Generate only the NEXT occurrence of each recurring service
  for (const service of serviceTimes) {
    // Skip regular weekly services (Sunday Service, combined Digging Deep / Faith Clinic)
    if (service.recurring === "weekly" && !service.alternateWith) {
      continue
    }

    // Handle alternating weekly services (Digging Deep and Faith Clinic)
    if (service.recurring === "alternating-weekly") {
      // Find the next Wednesday
      const nextWednesday = getNextWednesday(now)
      if (!nextWednesday) continue

      // The next Wednesday is always Digging Deep (Bible Study Series)
      // The following Wednesday will be Faith Clinic
      // Pattern: Digging Deep (next Wed), Faith Clinic (next+1 Wed), Digging Deep (next+2 Wed), etc.
      
      let targetWednesday: Date | null = null
      
      if (service.name === "Digging Deep") {
        // Digging Deep is on the next Wednesday (week 0)
        targetWednesday = new Date(nextWednesday)
      } else if (service.name === "Faith Clinic") {
        // Faith Clinic is on the Wednesday after next (week 1)
        targetWednesday = new Date(nextWednesday)
        targetWednesday.setDate(targetWednesday.getDate() + 7)
      }

      if (targetWednesday) {
        // Set the service time
        const parsedTime = parseTimeString(service.time)
        if (parsedTime) {
          targetWednesday.setHours(parsedTime.hours, parsedTime.minutes, 0, 0)
        }

        // Only add if the date is in the future
        if (targetWednesday > now) {
          const slug = `${service.name.toLowerCase().replace(/\s+/g, "-")}-${targetWednesday.getFullYear()}-${String(targetWednesday.getMonth() + 1).padStart(2, "0")}-${String(targetWednesday.getDate()).padStart(2, "0")}`

          events.push({
            id: `recurring-${slug}`,
            slug,
            title: service.name === "Digging Deep" ? "Bible Study Series" : service.name,
            description: service.description || "",
            content: eventContent[service.name] || "",
            date: targetWednesday,
            time: service.time,
            location: "Main Sanctuary",
            image: eventImages[service.name] || {
              url: "/images/fullPhoto_Homepage.png",
              alt: service.name,
            },
            featured: true,
          })
        }
      }
      continue
    }

    // Handle monthly recurring services (Youth Ministry, Thanksgiving)
    if (service.recurring !== "monthly-first" && service.recurring !== "monthly-third") {
      continue
    }

    let nextEventDate: Date | null = null

    // Search through months to find the next occurrence
    for (let monthOffset = 0; monthOffset <= monthsAhead; monthOffset++) {
      const checkDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
      let candidateDate: Date | null = null

      if (service.recurring === "monthly-first" && service.day === "first-sunday") {
        candidateDate = new Date(getFirstSundayOfMonth(checkDate))
      } else if (service.recurring === "monthly-third" && service.day === "third-sunday") {
        candidateDate = new Date(getThirdSundayOfMonth(checkDate))
      }

      if (candidateDate) {
        const parsedTime = parseTimeString(service.time)
        if (parsedTime) {
          candidateDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0)
        }

        // Check if this date is in the future (hasn't passed yet)
        if (candidateDate > now) {
          nextEventDate = candidateDate
          break // Found the next occurrence, stop searching
        }
      }
    }

    // If we found a next occurrence, create the event
    if (nextEventDate) {
      const slug = `${service.name.toLowerCase().replace(/\s+/g, "-")}-${nextEventDate.getFullYear()}-${String(nextEventDate.getMonth() + 1).padStart(2, "0")}-${String(nextEventDate.getDate()).padStart(2, "0")}`

      events.push({
        id: `recurring-${slug}`,
        slug,
        title: service.name,
        description: service.description || "",
        content: eventContent[service.name] || "",
        date: nextEventDate,
        time: service.time,
        location: "Main Sanctuary",
        image: eventImages[service.name] || {
          url: "/images/fullPhoto_Homepage.png",
          alt: service.name,
        },
        featured: true,
      })
    }
  }

  return events
}

