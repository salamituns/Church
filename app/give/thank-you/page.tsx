"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function ThankYouContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isRecurring, setIsRecurring] = useState(false)

  useEffect(() => {
    // If there's a session_id, it's from a recurring donation (Stripe Checkout)
    if (sessionId) {
      setIsRecurring(true)
    }
  }, [sessionId])

  return (
    <div className="container py-12">
      <Card className="mx-auto max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl">Thank You!</CardTitle>
          <CardDescription className="text-lg">
            Your donation has been received successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            We are grateful for your generosity and support. Your contribution helps us 
            continue serving our community and spreading the gospel.
          </p>
          {isRecurring && (
            <p className="text-sm font-medium text-primary">
              Your recurring donation has been set up successfully. Thank you for your ongoing support!
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly with your donation receipt.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/give">Make Another Donation</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="container py-12">
        <Card className="mx-auto max-w-2xl text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}