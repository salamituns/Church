import { PastorCard } from "@/components/sections/PastorCard"
import { getPastors } from "@/lib/cms/queries"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "About Us | RCCG Shiloh Mega Parish",
  description: "Learn about RCCG Shiloh Mega Parish, our mission, vision, and leadership team.",
}

export default async function AboutPage() {
  const pastors = await getPastors()

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">About Us</h1>
        <p className="text-lg text-muted-foreground">
          Learn more about RCCG Shiloh Mega Parish
        </p>
      </div>

      <div className="mb-12">
        <Card>
          <CardContent className="p-8">
            <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
            <p className="mb-6 text-muted-foreground">
              RCCG Shiloh Mega Parish is committed to spreading the gospel, building 
              a strong community of believers, and serving our neighbors in Sugar Land, 
              Texas and beyond. We believe in the power of faith, fellowship, and 
              service to transform lives.
            </p>
            <h2 className="mb-4 text-2xl font-semibold">Our Vision</h2>
            <p className="text-muted-foreground">
              To be a beacon of hope and a place where people can encounter God, 
              grow in their faith, and make a positive impact in their communities. 
              We envision a church where everyone feels welcomed, valued, and empowered 
              to fulfill their God-given purpose.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Meet the Pastors</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {pastors.map((pastor) => (
            <PastorCard
              key={pastor.id}
              name={pastor.name}
              title={pastor.title}
              image={pastor.image.url}
              bio={pastor.bio}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

