"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Send } from "lucide-react"
import { contactFormSchema } from "@/lib/validations/contact"
import { useToast } from "@/components/ui/toast"

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContactFormProps {
  type?: "general" | "prayer" | "visitor"
  title?: string
  description?: string
}

export function ContactForm({
  type = "general",
  title = "Get in Touch",
  description = "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
}: ContactFormProps) {
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      type,
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to send message')
      }

      setIsSuccess(true)
      reset()

      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'There was an error sending your message. Please try again.'
      addToast(errorMessage, 'error', 8000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mb-2 text-2xl font-semibold">Message Sent!</h3>
          <p className="text-muted-foreground">
            Thank you for reaching out. We'll get back to you soon.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Name *</label>
              <input
                type="text"
                {...register("name")}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="John Doe"
                aria-label="Name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Email *</label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="john@example.com"
                aria-label="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Phone (Optional)</label>
              <input
                type="tel"
                {...register("phone")}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="(555) 123-4567"
                aria-label="Phone"
              />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Subject *</label>
              <input
                type="text"
                {...register("subject")}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="How can we help?"
                aria-label="Subject"
              />
            {errors.subject && (
              <p className="mt-1 text-sm text-destructive">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Message *</label>
            <textarea
              {...register("message")}
              rows={6}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Your message here..."
              aria-label="Message"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

