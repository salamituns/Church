import { DonationForm } from "@/components/forms/DonationForm"

export const metadata = {
  title: "Give | RCCG Shiloh Mega Parish",
  description: "Support RCCG Shiloh Mega Parish through online giving. Your generosity helps us serve our community.",
}

export default function GivePage() {
  const stripePublishableKey = 
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
  process.env.STRIPE_PUBLIC_KEY
  return (
    <div className="container py-12">
      <DonationForm stripePublishableKey={stripePublishableKey} />
    </div>
  )
}

