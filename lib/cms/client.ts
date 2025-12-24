import type {
  Pastor,
  Ministry,
  Event,
  Sermon,
  Testimonial,
  Page,
} from "./types"

/**
 * CMS Client Interface
 * 
 * This is a flexible CMS client that can be implemented for any headless CMS.
 * For now, it provides mock data. Replace with actual CMS SDK calls.
 * 
 * Supported CMS options:
 * - Contentful: Use @contentful/rich-text-react-renderer
 * - Sanity: Use @sanity/client and @portabletext/react
 * - Strapi: Use strapi-sdk or direct fetch calls
 */

// Mock data - Replace with actual CMS queries
const mockPastors: Pastor[] = [
  {
    id: "1",
    name: "Pastor Moses Olise",
    title: "Senior Pastor",
    bio: "Leading with vision and passion for God's work.",
    image: {
      url: "/images/pastorOlise.webp",
      alt: "Pastor Moses Olise",
    },
  },
  {
    id: "2",
    name: "Pastor Caroline Olise",
    title: "Assistant Pastor",
    bio: "Dedicated to serving the community with love and grace.",
    image: {
      url: "/images/AsstPastor_Olise.webp",
      alt: "Pastor Caroline Olise",
    },
  },
]

const mockMinistries: Ministry[] = [
  {
    id: "1",
    slug: "children-ministry",
    title: "Children's Ministry",
    description: "Nurturing young hearts in faith and love.",
    image: { url: "/images/children-ministry-587x440.webp", alt: "Children's Ministry" },
    category: "age-groups",
  },
  {
    id: "2",
    slug: "youth-ministry",
    title: "Youth Ministry",
    description: "Empowering the next generation of believers.",
    image: { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop", alt: "Youth Ministry" },
    category: "age-groups",
  },
  {
    id: "3",
    slug: "young-adults",
    title: "Young Adults",
    description: "Building community and faith for young adults.",
    image: { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop", alt: "Young Adults" },
    category: "age-groups",
  },
  {
    id: "4",
    slug: "worship-ministry",
    title: "Worship Ministry",
    description: "Leading the congregation in praise and worship.",
    image: { url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop", alt: "Worship Ministry" },
    category: "service",
  },
  {
    id: "5",
    slug: "prayer-ministry",
    title: "Prayer Ministry",
    description: "Interceding for the church and community.",
    image: { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop", alt: "Prayer Ministry" },
    category: "service",
  },
  {
    id: "6",
    slug: "evangelism",
    title: "Evangelism",
    description: "Sharing the gospel with our community.",
    image: { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop", alt: "Evangelism" },
    category: "service",
  },
  {
    id: "7",
    slug: "media-ministry",
    title: "Media Ministry",
    description: "Serving through technology and creative arts.",
    image: { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop", alt: "Media Ministry" },
    category: "service",
  },
  {
    id: "8",
    slug: "small-groups",
    title: "Small Groups",
    description: "Connect, grow, and serve in community.",
    image: { url: "https://images.unsplash.com/photo-1528607929212-9516a1b4e52c?w=800&h=600&fit=crop", alt: "Small Groups" },
    category: "community",
  },
  {
    id: "9",
    slug: "bible-study",
    title: "Bible Study",
    description: "Deep dive into God's Word together.",
    image: { url: "/images/digging-deep-587x428.webp", alt: "Bible Study" },
    category: "community",
  },
  {
    id: "10",
    slug: "women-ministry",
    title: "Women's Ministry",
    description: "Building strong women of faith.",
    image: { url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop", alt: "Women's Ministry" },
    category: "age-groups",
  },
  {
    id: "11",
    slug: "faith-clinic",
    title: "Faith Clinic",
    description: "A place for healing, restoration, and spiritual growth through prayer and the Word.",
    image: { url: "/images/faith-clinic-587x410.webp", alt: "Faith Clinic" },
    category: "service",
  },
]

class CMSClient {
  async getPastors(): Promise<Pastor[]> {
    // TODO: Replace with actual CMS query
    // Example for Contentful:
    // const entries = await client.getEntries({ content_type: 'pastor' })
    return mockPastors
  }

  async getPastor(id: string): Promise<Pastor | null> {
    const pastors = await this.getPastors()
    return pastors.find((p) => p.id === id) || null
  }

  async getMinistries(): Promise<Ministry[]> {
    // TODO: Replace with actual CMS query
    return mockMinistries
  }

  async getMinistry(slug: string): Promise<Ministry | null> {
    const ministries = await this.getMinistries()
    return ministries.find((m) => m.slug === slug) || null
  }

  async getEvents(limit?: number): Promise<Event[]> {
    // TODO: Replace with actual CMS query
    const mockEvents: Event[] = [
      {
        id: "1",
        slug: "christmas-service",
        title: "Christmas Service",
        description: "Join us for a special Christmas celebration with music, worship, and the message of hope.",
        date: new Date("2025-12-25"),
        time: "10:00 AM",
        location: "Main Sanctuary",
        image: { url: "/images/christmas-service-1.webp", alt: "Christmas Service" },
        featured: true,
      },
      {
        id: "2",
        slug: "new-year-service",
        title: "New Year Service",
        description: "Start the new year in prayer and worship. Dedicate 2025 to God's purpose.",
        date: new Date("2026-01-01"),
        time: "10:00 AM",
        location: "Main Sanctuary",
        image: { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop", alt: "New Year Service" },
        featured: true,
      },
      {
        id: "3",
        slug: "prayer-night",
        title: "Night of Prayer",
        description: "Join us for an evening of intercession and seeking God's face.",
        date: new Date("2025-01-15"),
        time: "7:00 PM",
        location: "Main Sanctuary",
        image: { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop", alt: "Night of Prayer" },
        featured: true,
      },
      {
        id: "4",
        slug: "youth-conference",
        title: "Youth Conference",
        description: "Empowering the next generation to live out their faith boldly.",
        date: new Date("2025-02-10"),
        time: "9:00 AM",
        location: "Main Sanctuary",
        image: { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop", alt: "Youth Conference" },
        featured: true,
      },
      {
        id: "5",
        slug: "bible-study-series",
        title: "Bible Study Series",
        description: "Deep dive into God's Word with our weekly Bible study sessions.",
        date: new Date("2025-01-20"),
        time: "7:00 PM",
        location: "Main Sanctuary",
        image: { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop&q=80", alt: "Bible Study Series" },
      },
      {
        id: "6",
        slug: "worship-night",
        title: "Worship Night",
        description: "An evening of powerful worship and praise. Come experience God's presence.",
        date: new Date("2025-02-15"),
        time: "7:00 PM",
        location: "Main Sanctuary",
        image: { url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop", alt: "Worship Night" },
      },
      {
        id: "7",
        slug: "christmas-carol-night",
        title: "Christmas Carol Night",
        description: "Join us for an evening of Christmas carols, fellowship, and celebration of the birth of Christ.",
        date: new Date("2025-12-20"),
        time: "7:00 PM",
        location: "Main Sanctuary",
        image: { url: "/images/christmas-carol-nigh.webp", alt: "Christmas Carol Night" },
        featured: true,
      },
      {
        id: "8",
        slug: "love-feast",
        title: "Love Feast",
        description: "A special time of fellowship, sharing, and breaking bread together as a community.",
        date: new Date("2025-12-21"),
        time: "6:00 PM",
        location: "Fellowship Hall",
        image: { url: "/images/love-feast-587x587.webp", alt: "Love Feast" },
        featured: true,
      },
    ]
    return limit ? mockEvents.slice(0, limit) : mockEvents
  }

  async getEvent(slug: string): Promise<Event | null> {
    const events = await this.getEvents()
    return events.find((e) => e.slug === slug) || null
  }

  async getSermons(limit?: number): Promise<Sermon[]> {
    // TODO: Replace with actual CMS query
    const mockSermons: Sermon[] = [
      {
        id: "1",
        slug: "this-is-not-the-end",
        title: "This is not the end",
        description: "Finding hope and new beginnings in Christ. Discover how God's promises bring light even in the darkest moments.",
        date: new Date("2025-12-21"),
        speaker: "Pastor Moses Olise",
        series: "Living by Faith",
        image: { url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop&q=80", alt: "This is not the end" },
        videoUrl: "https://www.youtube.com/live/CGvZhdLLN0k?si=eByAbzmiKdjdRdR1",
        audioUrl: "https://example.com/audio.mp3",
      },
      {
        id: "2",
        slug: "hope-in-hard-times",
        title: "Hope in Hard Times",
        description: "Finding strength and hope when life gets difficult.",
        date: new Date("2024-12-08"),
        speaker: "Pastor Caroline Olise",
        image: { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=800&fit=crop", alt: "Hope in Hard Times" },
        videoUrl: "https://youtube.com/watch?v=example2",
      },
    ]
    return limit ? mockSermons.slice(0, limit) : mockSermons
  }

  async getSermon(slug: string): Promise<Sermon | null> {
    const sermons = await this.getSermons()
    return sermons.find((s) => s.slug === slug) || null
  }

  async getTestimonials(): Promise<Testimonial[]> {
    // TODO: Replace with actual CMS query
    return [
      {
        id: "1",
        name: "Ola",
        role: "Member",
        content: "This church has been a blessing to my family. The community is welcoming and the teaching is powerful.",
      },
      {
        id: "2",
        name: "Jane",
        role: "Member",
        content: "I found my spiritual home here. The pastors are caring and the ministries are life-changing.",
      },
    ]
  }

  async getPage(slug: string): Promise<Page | null> {
    // TODO: Replace with actual CMS query
    return null
  }
}

export const cmsClient = new CMSClient()

