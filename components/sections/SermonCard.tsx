import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Calendar, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SermonCardProps {
  slug: string
  title: string
  description: string
  date: Date
  speaker?: string
  series?: string
  image?: string
  videoUrl?: string
  audioUrl?: string
}

export function SermonCard({
  slug,
  title,
  description,
  date,
  speaker,
  series,
  image,
  videoUrl,
  audioUrl,
}: SermonCardProps) {
  const hasMedia = videoUrl || audioUrl

  return (
    <Card className="group h-full transition-shadow hover:shadow-lg">
      {image && (
        <Link href={`/sermons/${slug}`}>
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {hasMedia && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-12 w-12 text-white" />
              </div>
            )}
          </div>
        </Link>
      )}
      <CardHeader>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(date, "MMMM d, yyyy")}</span>
        </div>
        {series && (
          <p className="mb-1 text-xs font-medium text-primary">{series}</p>
        )}
        <CardTitle>
          <Link href={`/sermons/${slug}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </CardTitle>
        {speaker && (
          <p className="text-sm text-muted-foreground">by {speaker}</p>
        )}
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {videoUrl && (
            <Button asChild variant="default" className="flex-1">
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                <Play className="mr-2 h-4 w-4" />
                Watch
              </a>
            </Button>
          )}
          {audioUrl && (
            <Button asChild variant="outline" className="flex-1">
              <a href={audioUrl} target="_blank" rel="noopener noreferrer">
                <Headphones className="mr-2 h-4 w-4" />
                Listen
              </a>
            </Button>
          )}
          {!videoUrl && !audioUrl && (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/sermons/${slug}`}>View Details</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

