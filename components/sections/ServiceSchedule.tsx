"use client"

import { Clock, Calendar as CalendarIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { StaggerChildren } from "@/components/animations/StaggerChildren"
import { FadeInItem } from "@/components/animations/FadeInItem"
import Link from "next/link"

const services = [
  {
    day: "Every Sunday",
    time: "9:20 AM",
    name: "Sunday Service",
    description: "Main worship service",
  },
  {
    day: "Every Wednesday",
    time: "7:00 PM",
    name: "Digging Deep / Faith Clinic",
    description: "Bible study and prayer session",
  },
  {
    day: "1st Sunday",
    time: "9:20 AM",
    name: "Thanksgiving Service",
    description: "Monthly thanksgiving celebration",
  },
]

export function ServiceSchedule() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <FadeInItem>
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-white sm:text-2xl md:text-3xl">
            Church Schedule
          </h2>
          <p className="text-sm sm:text-base text-white/80">Please join our services</p>
        </div>
      </FadeInItem>

      <StaggerChildren className="grid gap-3 sm:gap-4 md:grid-cols-3" role="list">
        {services.map((service) => (
          <FadeInItem key={service.day}>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-white/20 bg-white/10 backdrop-blur-sm min-w-0" role="listitem">
            <CardContent className="p-4 sm:p-5 md:p-6 text-center">
              <div className="mb-2 sm:mb-3 flex justify-center">
                <div className="rounded-full bg-white/20 p-2 sm:p-3">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <h3 className="mb-1 text-base sm:text-lg font-semibold text-white">
                {service.name}
              </h3>
              <p className="mb-2 sm:mb-3 text-xs sm:text-sm text-white/80">
                {service.description}
              </p>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-white whitespace-nowrap">
                <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium whitespace-nowrap">{service.day}</span>
                <span className="mx-0.5 sm:mx-1 flex-shrink-0">•</span>
                <span className="text-sm sm:text-base whitespace-nowrap">{service.time}</span>
              </div>
            </CardContent>
          </Card>
            </motion.div>
          </FadeInItem>
        ))}
      </StaggerChildren>

      <div className="mt-6 text-center">
        <Link
          href="/visit"
          className="text-sm text-white/90 underline hover:text-white"
        >
          What to expect on your first visit →
        </Link>
      </div>
    </div>
  )
}

