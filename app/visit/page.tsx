import { ContactForm } from "@/components/forms/ContactForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Car, Users, Heart } from "lucide-react"

export const metadata = {
  title: "Visit Us | RCCG Shiloh Mega Parish",
  description: "Plan your visit to RCCG Shiloh Mega Parish in Sugar Land, Texas. Get directions, parking information, and learn what to expect.",
}

export default function VisitPage() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Visit Us</h1>
        <p className="text-lg text-muted-foreground">
          We'd love to welcome you to RCCG Shiloh Mega Parish
        </p>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="mb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Our Location</CardTitle>
            </div>
            <CardDescription>Shiloh Mega Parish, Sugar Land, Texas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3466.1!2d-95.6089!3d29.5377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640e5d5d5d5d5d5%3A0x0!2s10130+Belknap+Rd%2C+Sugar+Land%2C+TX+77478!5e0!3m2!1sen!2sus!4v1703000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Church Location"
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground">
                10130 Belknap Rd<br />
                Sugar Land, TX 77478
              </p>
              <p className="font-medium mt-4">Phone</p>
              <p className="text-muted-foreground">
                <a href="tel:281-840-1614" className="hover:text-primary">(281) 840-1614</a>
              </p>
              <p className="font-medium mt-4">Email</p>
              <p className="text-muted-foreground">
                <a href="mailto:churchoffice@rccgshilohmega.org" className="hover:text-primary">churchoffice@rccgshilohmega.org</a>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Service Times</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">Sunday Service</p>
              <p className="text-muted-foreground">10:00 AM</p>
            </div>
            <div>
              <p className="font-semibold">Wednesday</p>
              <p className="text-muted-foreground">7:00 PM - Digging Deep / Faith Clinic</p>
            </div>
            <div>
              <p className="font-semibold">Last Sunday of Month</p>
              <p className="text-muted-foreground">10:00 AM - Anointing Service</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-center">What to Expect</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Welcoming Community</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You'll be greeted with warm smiles and friendly faces. We're a diverse 
                community that welcomes everyone.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                <CardTitle>Parking</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Free parking is available on-site. We have designated spaces for 
                first-time visitors near the main entrance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>Children Welcome</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We have programs for children of all ages. Your kids will love our 
                engaging children's ministry.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-3xl font-bold text-center">Get in Touch</h2>
        <ContactForm
          type="visitor"
          title="Plan Your Visit"
          description="Let us know you're coming! Fill out this form and we'll be ready to welcome you."
        />
      </div>
    </div>
  )
}

