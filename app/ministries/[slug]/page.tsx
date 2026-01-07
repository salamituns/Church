import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getMinistry, getMinistries } from "@/lib/cms/queries"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const ministries = await getMinistries()
  return ministries.map((ministry) => ({
    slug: ministry.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const ministry = await getMinistry(slug)

  if (!ministry) {
    return {
      title: "Ministry Not Found",
    }
  }

  return {
    title: `${ministry.title} | RCCG Shiloh Mega Parish`,
    description: ministry.description,
    openGraph: {
      url: `https://rccgshilohmega.org/ministries/${slug}`,
    },
  }
}

export default async function MinistryPage({ params }: PageProps) {
  const { slug } = await params
  const ministry = await getMinistry(slug)

  if (!ministry) {
    notFound()
  }

  // Get related ministries (prefer same category, then others)
  const allMinistries = await getMinistries()
  const relatedMinistries = allMinistries
    .filter((m) => m.slug !== slug)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === ministry.category && b.category !== ministry.category) return -1
      if (a.category !== ministry.category && b.category === ministry.category) return 1
      return 0
    })
    .slice(0, 3)

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/ministries">
              <ArrowLeft className="h-4 w-4" />
              Back to Ministries
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          {ministry.image && (
            <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
              <Image
                src={ministry.image.url}
                alt={ministry.image.alt || ministry.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}

        <h1 className="mb-4 text-4xl font-bold">{ministry.title}</h1>
        <p className="mb-6 text-xl text-muted-foreground">{ministry.description}</p>

        {ministry.leader && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-muted-foreground">Ministry Leader</p>
              <p className="text-lg">{ministry.leader}</p>
            </CardContent>
          </Card>
        )}

        {ministry.content && (
          <div
            className="prose prose-lg mb-8 max-w-none prose-headings:font-semibold prose-h3:text-lg prose-ul:list-none prose-li:marker:hidden"
            dangerouslySetInnerHTML={{ __html: ministry.content }}
          />
        )}
        </div>

        {/* Related Ministries Section */}
        {relatedMinistries.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Other Ministries</h2>
                <p className="text-muted-foreground">Explore more ways to get involved</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/ministries">
                  View All Ministries
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedMinistries.map((relatedMinistry) => (
                <Link key={relatedMinistry.slug} href={`/ministries/${relatedMinistry.slug}`}>
                  <Card className="group h-full transition-all hover:shadow-lg">
                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={relatedMinistry.image.url}
                        alt={relatedMinistry.image.alt || relatedMinistry.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold group-hover:text-primary transition-colors">
                        {relatedMinistry.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {relatedMinistry.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

