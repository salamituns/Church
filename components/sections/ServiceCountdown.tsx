"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock } from "lucide-react"
import { getNextService, formatTimeRemaining } from "@/lib/utils/serviceTimes"
import { Card, CardContent } from "@/components/ui/card"
import type { Event } from "@/lib/cms/types"

interface ServiceCountdownProps {
  events?: Event[]
}

export function ServiceCountdown({ events }: ServiceCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [nextService, setNextService] = useState<{
    service: { name: string; time: string; description?: string }
    date: Date
  } | null>(null)

  useEffect(() => {
    const service = getNextService(events)
    setNextService(service)

    if (service) {
      const updateCountdown = () => {
        const remaining = formatTimeRemaining(service.date)
        setTimeRemaining(remaining)
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 1000)

      return () => clearInterval(interval)
    }
  }, [events])

  if (!nextService || !timeRemaining) {
    return null
  }

  return (
    <Card className="border-white/20 bg-white/10 backdrop-blur-sm w-full max-w-[280px] sm:max-w-[320px] md:w-64">
      <CardContent className="p-3 sm:p-4">
        <div className="mb-2 sm:mb-3 flex items-center justify-center gap-2 text-white">
          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
          <p className="text-[10px] sm:text-xs font-medium">Next Service</p>
        </div>

        <div className="mb-2 sm:mb-3 grid grid-cols-4 gap-1 sm:gap-1.5 text-center">
          {[
            { value: timeRemaining.days, label: "Days" },
            { value: timeRemaining.hours, label: "Hrs" },
            { value: timeRemaining.minutes, label: "Min" },
            { value: timeRemaining.seconds, label: "Sec" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="rounded bg-white/20 p-1.5 sm:p-2 backdrop-blur-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.value}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm sm:text-base md:text-lg font-bold text-white"
                >
                  {String(item.value).padStart(2, "0")}
                </motion.div>
              </AnimatePresence>
              <div className="text-[9px] sm:text-[10px] text-white/80">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-[10px] sm:text-xs font-semibold text-white leading-tight">{nextService.service.name}</p>
          <p className="text-[9px] sm:text-xs text-white/80">{nextService.service.time}</p>
        </div>
      </CardContent>
    </Card>
  )
}

