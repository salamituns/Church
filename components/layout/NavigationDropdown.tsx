"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Ministry, MinistryCategory } from "@/lib/cms/types"

interface NavigationDropdownProps {
  ministries: Ministry[]
  className?: string
  onLinkClick?: () => void
  mobile?: boolean
}

const categoryLabels: Record<MinistryCategory, string> = {
  "age-groups": "Age Groups",
  service: "Service Ministries",
  community: "Community Groups",
}

export function NavigationDropdown({ ministries, className, onLinkClick, mobile = false }: NavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleLinkClick = () => {
    setIsOpen(false)
    onLinkClick?.()
  }

  const ministriesByCategory = ministries.reduce(
    (acc, ministry) => {
      if (!acc[ministry.category]) {
        acc[ministry.category] = []
      }
      acc[ministry.category].push(ministry)
      return acc
    },
    {} as Record<MinistryCategory, Ministry[]>
  )

  // Mobile: render as accordion-style inline dropdown
  if (mobile) {
    return (
      <div className={cn("w-full", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-sm font-medium transition-colors hover:text-primary py-1"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>Ministries</span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-1 space-y-4">
                {Object.entries(ministriesByCategory).map(([category, categoryMinistries]) => (
                  <div key={category}>
                    {/* Category header with distinct background */}
                    <div className="flex items-center gap-2 px-3 py-2 mb-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {categoryLabels[category as MinistryCategory]}
                    </div>
                    {/* Ministry links with left border indicator */}
                    <div className="ml-3 pl-3 border-l-2 border-muted space-y-0.5">
                      {categoryMinistries.map((ministry) => (
                        <Link
                          key={ministry.id}
                          href={`/ministries/${ministry.slug}`}
                          onClick={handleLinkClick}
                          className="block text-sm text-foreground hover:text-primary hover:bg-accent/50 transition-colors py-2 px-2 rounded-md"
                        >
                          {ministry.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3 px-3">
                  <Link
                    href="/ministries"
                    onClick={handleLinkClick}
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors py-2.5 px-4 rounded-md"
                  >
                    View All Ministries →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Desktop: render as floating dropdown
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Ministries
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 hidden md:block"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-lg border bg-background shadow-xl max-h-[85vh] overflow-y-auto overscroll-contain dropdown-scroll hidden md:block"
              style={{ 
                maxWidth: 'min(calc(100vw - 1rem), 24rem)',
                minWidth: '20rem',
              }}
            >
              <div className="p-3 min-w-0">
                {Object.entries(ministriesByCategory).map(([category, categoryMinistries]) => (
                  <div
                    key={category}
                    className="mb-3 last:mb-0"
                  >
                    <div className="px-3 py-2 mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-muted/50 rounded-md">
                      {categoryLabels[category as MinistryCategory]}
                    </div>
                    <div className="space-y-0.5">
                      {categoryMinistries.map((ministry) => (
                        <Link
                          key={ministry.id}
                          href={`/ministries/${ministry.slug}`}
                          onClick={handleLinkClick}
                          className="block rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-foreground w-full"
                        >
                          {ministry.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="border-t border-border mt-3 pt-3">
                  <Link
                    href="/ministries"
                    onClick={handleLinkClick}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-accent"
                  >
                    View All Ministries →
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

