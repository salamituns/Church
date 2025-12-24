"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { NavigationDropdown } from "./NavigationDropdown"
import type { Ministry } from "@/lib/cms/types"

interface NavigationProps {
  className?: string
  ministries?: Ministry[]
  onLinkClick?: () => void
  mobile?: boolean
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Activities" },
  { href: "/about", label: "About Us" },
  { href: "/visit", label: "Visit Us" },
  { href: "/sermons", label: "Sermons" },
]

export function Navigation({ className, ministries = [], onLinkClick, mobile = false }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("items-center gap-6", className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary relative",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.label}
            {isActive && (
              <motion.div
                layoutId="activeNav"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        )
      })}
      {ministries.length > 0 && (
        <NavigationDropdown ministries={ministries} onLinkClick={onLinkClick} mobile={mobile} />
      )}
      {ministries.length === 0 && (
        <Link
          href="/ministries"
          onClick={onLinkClick}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname?.startsWith("/ministries") ? "text-primary" : "text-muted-foreground"
          )}
        >
          Ministries
        </Link>
      )}
    </nav>
  )
}

