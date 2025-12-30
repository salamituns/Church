"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Heart } from "lucide-react"

// Initialize Stripe only if publishable key is available
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

const donationSchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1"),
  frequency: z.enum(["one-time", "monthly", "weekly"]),
  purpose: z.enum(["Offering", "Tithe", "Thanksgiving", "Welfare", "Church projects", "Seed", "Mission"], {
    required_error: "Please select a donation purpose",
  }),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().optional(),
})

const donationPurposes = [
  "Offering",
  "Tithe",
  "Thanksgiving",
  "Welfare",
  "Church projects",
  "Seed",
  "Mission",
] as const

type DonationFormData = z.infer<typeof donationSchema>

const presetAmounts = [25, 50, 100, 250, 500]

// Payment Form Component (wrapped in Elements)
function PaymentForm({ formData }: { formData: DonationFormData }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/give/thank-you`,
        },
      })

      if (confirmError) {
        setErrorMessage(confirmError.message || "Payment failed")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setErrorMessage("An error occurred. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Donation Amount: ${formData.amount.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">
          Purpose: {formData.purpose}
        </p>
        <p className="text-xs text-muted-foreground">
          {formData.name} ({formData.email})
        </p>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isProcessing || !stripe}>
        {isProcessing ? "Processing..." : `Donate $${formData.amount.toFixed(2)}`}
      </Button>
    </form>
  )
}

// Main Form Component
export function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      frequency: "one-time",
      purpose: "Offering",
    },
  })

  const frequency = watch("frequency")
  const purpose = watch("purpose")
  const amount = watch("amount")
  const formData = watch()

  const onFormSubmit = async (data: DonationFormData) => {
    setIsProcessing(true)
    try {
      if (data.frequency === "one-time") {
        // Create payment intent for one-time donations
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        const result = await response.json()

        if (result.error) {
          alert(result.error)
          setIsProcessing(false)
          return
        }

        setClientSecret(result.clientSecret)
        setShowPayment(true)
      } else {
        // For recurring, redirect to Stripe Checkout
        const response = await fetch("/api/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        const result = await response.json()

        if (result.error) {
          alert(result.error)
          setIsProcessing(false)
          return
        }

        if (result.url) {
          window.location.href = result.url
        }
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
      setIsProcessing(false)
    }
  }

  // Show payment form for one-time donations
  if (showPayment && clientSecret) {
    if (!stripePromise) {
      return (
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">Configuration Error</CardTitle>
            <CardDescription>
              Stripe is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.
            </CardDescription>
          </CardHeader>
        </Card>
      )
    }

    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Complete Your Donation</CardTitle>
          <CardDescription>
            Amount: ${amount?.toFixed(2)} (One-time) • Purpose: {formData.purpose}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
              },
            }}
          >
            <PaymentForm formData={formData} />
          </Elements>
        </CardContent>
      </Card>
    )
  }

  // Show configuration error if Stripe isn't set up
  if (!stripePublishableKey) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Heart className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-3xl">Payment System Setup Required</CardTitle>
          <CardDescription className="text-lg">
            Stripe payment processing needs to be configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To enable donations, please add your Stripe publishable key to the environment variables.
          </p>
          <div className="rounded-md bg-muted p-4">
            <p className="text-xs font-mono text-muted-foreground">
              Add to .env.local:
            </p>
            <p className="text-xs font-mono mt-2">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            See STRIPE_SETUP.md for detailed instructions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl">Support Our Church</CardTitle>
        <CardDescription className="text-lg">
          Your generosity helps us serve our community and spread the gospel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Select Amount</label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt)
                    setValue("amount", amt)
                  }}
                  className={`rounded-md border p-3 font-semibold transition-colors ${
                    selectedAmount === amt
                      ? "border-primary bg-primary text-white"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="number"
                placeholder="Custom amount"
                {...register("amount", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                onChange={(e) => {
                  const value = parseFloat(e.target.value)
                  if (!isNaN(value)) {
                    setSelectedAmount(null)
                    setValue("amount", value)
                  }
                }}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Frequency</label>
            <div className="grid grid-cols-3 gap-3">
              {(["one-time", "weekly", "monthly"] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setValue("frequency", freq)}
                  className={`rounded-md border p-3 text-sm font-medium capitalize transition-colors ${
                    frequency === freq
                      ? "border-primary bg-primary text-white"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {freq.replace("-", " ")}
                </button>
              ))}
            </div>
            {errors.frequency && (
              <p className="mt-1 text-sm text-destructive">{errors.frequency.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              What are you giving for? <span className="text-destructive">*</span>
            </label>
            <Select {...register("purpose")}>
              {donationPurposes.map((purposeOption) => (
                <option key={purposeOption} value={purposeOption}>
                  {purposeOption}
                </option>
              ))}
            </Select>
            {errors.purpose && (
              <p className="mt-1 text-sm text-destructive">{errors.purpose.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Your Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email Address</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Message (Optional)</label>
            <textarea
              {...register("message")}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Add a note with your donation..."
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Continue to Payment"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your donation is secure and encrypted. We use Stripe for secure payment processing.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
