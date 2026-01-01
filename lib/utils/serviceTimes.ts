import type { Event } from "@/lib/cms/types"

export interface ServiceTime {
  name: string
  day: "sunday" | "wednesday" | "last-sunday" | "friday"
  time: string
  description?: string
  special?: boolean
}

export const serviceTimes: ServiceTime[] = [
  {
    name: "Sunday Service",
    day: "sunday",
    time: "10:00 AM",
    description: "Main worship service",
  },
  {
    name: "Digging Deep / Faith Clinic",
    day: "wednesday",
    time: "7:00 PM",
    description: "Bible study and prayer",
  },
  {
    name: "Anointing Service",
    day: "last-sunday",
    time: "10:00 AM",
    description: "Special service on last Sunday of month",
    special: true,
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
  for (let i = 0; i < 14; i++) {
    const checkDate = new Date(now)
    checkDate.setDate(checkDate.getDate() + i)
    const checkDay = checkDate.getDay()

    for (const service of serviceTimes) {
      let matches = false

      if (service.day === "sunday" && checkDay === 0) {
        // Check if it's the last Sunday of the month for special services
        if (service.special) {
          const lastSunday = getLastSundayOfMonth(checkDate)
          if (checkDate.getDate() === lastSunday.getDate()) {
            matches = true
          }
        } else {
          matches = true
        }
      } else if (service.day === "wednesday" && checkDay === 3) {
        matches = true
      } else if (service.day === "last-sunday" && checkDay === 0) {
        const lastSunday = getLastSundayOfMonth(checkDate)
        if (checkDate.getDate() === lastSunday.getDate()) {
          matches = true
        }
      }

      if (matches) {
        const [hours, minutes] = service.time.split(":").map(Number)
        const serviceHour = hours + (service.time.includes("PM") && hours !== 12 ? 12 : 0)
        const serviceMinute = minutes || 0

        const serviceDate = new Date(checkDate)
        serviceDate.setHours(serviceHour, serviceMinute, 0, 0)

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
    const parseEventTime = (event: Event): Date => {
      const eventDate = new Date(event.date)
      if (event.time) {
        const timeStr = event.time.toUpperCase()
        const [hoursStr, minutesStr] = event.time.split(":")
        let hours = parseInt(hoursStr, 10)
        const minutes = parseInt(minutesStr?.split(/\s/)[0] || "0", 10)
        const isPM = timeStr.includes("PM")
        
        // Convert to 24-hour format
        if (isPM && hours !== 12) {
          hours += 12
        } else if (!isPM && hours === 12) {
          hours = 0
        }
        
        eventDate.setHours(hours, minutes, 0, 0)
      } else {
        eventDate.setHours(10, 0, 0, 0) // Default to 10:00 AM
      }
      return eventDate
    }

    const upcomingEvents = events
      .filter((event) => {
        const eventDate = parseEventTime(event)
        return eventDate > now
      })
      .map((event) => {
        const eventDate = parseEventTime(event)
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

function getLastSundayOfMonth(date: Date): Date {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const lastSunday = new Date(lastDay)
  lastSunday.setDate(lastDay.getDate() - lastDay.getDay())
  return lastSunday
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

