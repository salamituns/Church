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
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          We are committed to nurturing children in the ways of the Lord, creating a safe and fun environment where they can learn about Jesus and grow in their faith.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"Train up a child in the way he should go: and when he is old, he will not depart from it."</p>
          <p class="text-sm text-muted-foreground">Proverbs 22:6 (KJV)</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <h3 class="font-semibold">What We Offer</h3>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li>• Age-appropriate Bible lessons</li>
              <li>• Interactive worship & songs</li>
              <li>• Creative activities & crafts</li>
              <li>• Safe, supervised environment</li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-semibold">Our Mission</h3>
            <p class="text-sm text-muted-foreground">
              To help children discover God's love, understand His Word, and develop a personal relationship with Jesus that will guide them throughout their lives.
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "2",
    slug: "youth-ministry",
    title: "Youth Ministry",
    description: "Empowering the next generation of believers.",
    image: { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop", alt: "Youth Ministry" },
    category: "age-groups",
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          Empowering young people to live boldly for Christ through dynamic worship, relevant teaching, and authentic community.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"Let no man despise thy youth; but be thou an example of the believers..."</p>
          <p class="text-sm text-muted-foreground">1 Timothy 4:12 (KJV)</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <h3 class="font-semibold">What We Offer</h3>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li>• Dynamic worship & praise</li>
              <li>• Relevant Bible teaching</li>
              <li>• Small groups & mentorship</li>
              <li>• Outreach & service projects</li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-semibold">Our Vision</h3>
            <p class="text-sm text-muted-foreground">
              To equip youth with a strong biblical foundation, help them discover their God-given gifts, and empower them to be leaders and influencers for Christ.
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "3",
    slug: "young-adults",
    title: "Young Adults",
    description: "Building community and faith for young adults.",
    image: { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop", alt: "Young Adults" },
    category: "age-groups",
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          A community for young adults navigating career, relationships, and life decisions while growing in faith and building meaningful connections.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"Trust in the Lord with all thine heart; and lean not unto thine own understanding."</p>
          <p class="text-sm text-muted-foreground">Proverbs 3:5 (KJV)</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <h3 class="font-semibold">What We Offer</h3>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li>• Bible study & discussions</li>
              <li>• Fellowship & networking</li>
              <li>• Life skills workshops</li>
              <li>• Social events & activities</li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-semibold">Our Purpose</h3>
            <p class="text-sm text-muted-foreground">
              To provide a supportive community where young adults can grow spiritually, build lasting friendships, and discover God's purpose for their lives.
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "4",
    slug: "worship-ministry",
    title: "Worship Ministry",
    description: "Leading the congregation in praise and worship.",
    image: { url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop", alt: "Worship Ministry" },
    category: "service",
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          Leading the church in authentic worship through music, creating an atmosphere where God's presence is felt and hearts are transformed.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"Make a joyful noise unto the Lord, all ye lands. Serve the Lord with gladness: come before his presence with singing."</p>
          <p class="text-sm text-muted-foreground">Psalm 100:1-2 (KJV)</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <h3 class="font-semibold">What We Do</h3>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li>• Lead Sunday worship services</li>
              <li>• Special event performances</li>
              <li>• Rehearsals & training</li>
              <li>• Music & technical support</li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-semibold">Our Heart</h3>
            <p class="text-sm text-muted-foreground">
              We believe worship is more than music—it's a lifestyle of honoring God. Our goal is to usher people into God's presence and create space for transformation.
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "5",
    slug: "prayer-ministry",
    title: "Prayer Ministry",
    description: "Interceding for the church and community.",
    image: { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop", alt: "Prayer Ministry" },
    category: "service",
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          A dedicated team committed to intercessory prayer, standing in the gap for our church, community, and the needs of God's people.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"The effectual fervent prayer of a righteous man availeth much."</p>
          <p class="text-sm text-muted-foreground">James 5:16 (KJV)</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <h3 class="font-semibold">What We Do</h3>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li>• Corporate prayer meetings</li>
              <li>• Intercessory prayer chains</li>
              <li>• Prayer for services & events</li>
              <li>• Personal prayer requests</li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-semibold">Our Mission</h3>
            <p class="text-sm text-muted-foreground">
              To cover our church, leaders, and community in prayer, believing that prayer changes things and moves the hand of God.
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "6",
    slug: "evangelism",
    title: "Evangelism",
    description: "Sharing the gospel with our community.",
    image: { url: "/images/evangelism.avif", alt: "Evangelism" },
    category: "service",
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          Passionately sharing the good news of Jesus Christ with our community through outreach, evangelism, and acts of love.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"Go ye into all the world, and preach the gospel to every creature."</p>
          <p class="text-sm text-muted-foreground">Mark 16:15 (KJV)</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <h3 class="font-semibold">What We Do</h3>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li>• Community outreach events</li>
              <li>• Street evangelism</li>
              <li>• Door-to-door visitation</li>
              <li>• Training & equipping</li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-semibold">Our Heart</h3>
            <p class="text-sm text-muted-foreground">
              We believe everyone deserves to hear the gospel. Our mission is to reach the lost, share God's love, and see lives transformed by the power of Christ.
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "7",
    slug: "media-ministry",
    title: "Media Ministry",
    description: "Serving through technology and creative arts.",
    image: { url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop", alt: "Media Ministry" },
    category: "service",
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          Using technology and creative arts to enhance worship, share the message, and reach people through various media platforms.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"And whatsoever ye do, do it heartily, as to the Lord, and not unto men."</p>
          <p class="text-sm text-muted-foreground">Colossians 3:23 (KJV)</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <h3 class="font-semibold">What We Do</h3>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li>• Audio & video production</li>
              <li>• Live streaming services</li>
              <li>• Social media management</li>
              <li>• Graphic design & content</li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-semibold">Our Purpose</h3>
            <p class="text-sm text-muted-foreground">
              To use modern technology and creative skills to amplify God's message, making it accessible to more people and enhancing the worship experience.
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "8",
    slug: "small-groups",
    title: "Small Groups",
    description: "Connect, grow, and serve in community.",
    image: { url: "/images/small_groups.avif", alt: "Small Groups" },
    category: "community",
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          Small groups provide an intimate setting for Bible study, prayer, fellowship, and mutual support as we grow together in faith. Join us for our Home Caring Fellowship where we connect virtually to build community and grow in Christ.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"And they continued stedfastly in the apostles' doctrine and fellowship..."</p>
          <p class="text-sm text-muted-foreground">Acts 2:42 (KJV)</p>
        </div>

        <div class="space-y-6">
          <div class="bg-muted/50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4">Meeting Schedule</h3>
            <div class="space-y-2">
              <p class="text-lg"><strong>When:</strong> 3rd Sunday of the Month @ 6:00 PM</p>
              <p class="text-lg"><strong>Venue:</strong> Online via Zoom Meeting</p>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-4">Small Groups by Location</h3>
            <p class="text-sm text-muted-foreground mb-6">Find your group based on your zip code and connect with your leader:</p>
            
            <div class="grid gap-6 md:grid-cols-2">
              <div class="border rounded-lg p-5 bg-card">
                <h4 class="text-lg font-semibold mb-3 text-primary">BETHEL</h4>
                <div class="space-y-2">
                  <p class="text-sm font-medium">Zip Codes:</p>
                  <p class="text-sm text-muted-foreground">77545, 77459, 77583, 77518, 77449, 77493, 77477, 77460, 78626</p>
                  <p class="text-sm font-medium mt-3">Leader Contact:</p>
                  <p class="text-sm text-muted-foreground"><a href="tel:832-612-1020" class="text-primary hover:underline">832-612-1020</a></p>
                </div>
              </div>

              <div class="border rounded-lg p-5 bg-card">
                <h4 class="text-lg font-semibold mb-3 text-primary">MERCY LAND</h4>
                <div class="space-y-2">
                  <p class="text-sm font-medium">Zip Codes:</p>
                  <p class="text-sm text-muted-foreground">77406, 77407, 77469</p>
                  <p class="text-sm font-medium mt-3">Leader Contact:</p>
                  <p class="text-sm text-muted-foreground"><a href="tel:832-230-7027" class="text-primary hover:underline">832-230-7027</a></p>
                </div>
              </div>

              <div class="border rounded-lg p-5 bg-card">
                <h4 class="text-lg font-semibold mb-3 text-primary">SOARING EAGLE</h4>
                <div class="space-y-2">
                  <p class="text-sm font-medium">Zip Codes:</p>
                  <p class="text-sm text-muted-foreground">77082, 77083</p>
                  <p class="text-sm font-medium mt-3">Leader Contact:</p>
                  <p class="text-sm text-muted-foreground"><a href="tel:281-703-8627" class="text-primary hover:underline">281-703-8627</a></p>
                </div>
              </div>

              <div class="border rounded-lg p-5 bg-card">
                <h4 class="text-lg font-semibold mb-3 text-primary">OVERCOMER</h4>
                <div class="space-y-2">
                  <p class="text-sm font-medium">Zip Codes:</p>
                  <p class="text-sm text-muted-foreground">77479, 77489, 77498</p>
                  <p class="text-sm font-medium mt-3">Leader Contact:</p>
                  <p class="text-sm text-muted-foreground"><a href="tel:346-857-7157" class="text-primary hover:underline">346-857-7157</a></p>
                </div>
              </div>

              <div class="border rounded-lg p-5 bg-card">
                <h4 class="text-lg font-semibold mb-3 text-primary">MOUNT ZION</h4>
                <div class="space-y-2">
                  <p class="text-sm font-medium">Zip Codes:</p>
                  <p class="text-sm text-muted-foreground">77063, 77072, 77077, 77099</p>
                  <p class="text-sm font-medium mt-3">Leader Contact:</p>
                  <p class="text-sm text-muted-foreground"><a href="tel:281-818-1406" class="text-primary hover:underline">281-818-1406</a></p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 class="text-lg font-semibold mb-3">General Information</h3>
            <p class="text-sm text-muted-foreground mb-3">For more information about our Home Caring Fellowship, please contact:</p>
            <div class="space-y-1">
              <p class="text-sm"><a href="tel:+18325631827" class="text-primary hover:underline">+1 (832) 563-1827</a></p>
              <p class="text-sm"><a href="tel:+13478690290" class="text-primary hover:underline">+1 (347) 869-0290</a></p>
            </div>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "10",
    slug: "women-ministry",
    title: "Women's Ministry",
    description: "Building strong women of faith.",
    image: { url: "/images/womens_fellowship.avif", alt: "Women's Ministry" },
    category: "age-groups",
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          A community of women supporting each other, growing in faith, and discovering their God-given purpose and identity in Christ.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"She is clothed with strength and dignity; she can laugh at the days to come."</p>
          <p class="text-sm text-muted-foreground">Proverbs 31:25 (NIV)</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <h3 class="font-semibold">What We Offer</h3>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li>• Bible studies & workshops</li>
              <li>• Fellowship & networking</li>
              <li>• Prayer & encouragement</li>
              <li>• Special events & retreats</li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-semibold">Our Mission</h3>
            <p class="text-sm text-muted-foreground">
              To empower women to become all God created them to be—strong in faith, confident in their identity, and impactful in their spheres of influence.
            </p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: "11",
    slug: "mens-ministry",
    title: "Men's Ministry",
    description: "Building strong men of faith and character.",
    image: { url: "/images/Mens_fellowship.avif", alt: "Men's Ministry" },
    category: "age-groups",
    content: `
      <div class="space-y-8">
        <p class="text-lg leading-relaxed text-muted-foreground">
          Empowering men to be godly leaders, faithful husbands, loving fathers, and strong pillars in their families and communities.
        </p>
        
        <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
          <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
          <p class="text-lg font-medium italic mb-2">"Watch ye, stand fast in the faith, quit you like men, be strong."</p>
          <p class="text-sm text-muted-foreground">1 Corinthians 16:13 (KJV)</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <div class="space-y-3">
            <h3 class="font-semibold">What We Offer</h3>
            <ul class="space-y-1.5 text-sm text-muted-foreground">
              <li>• Bible study & discipleship</li>
              <li>• Accountability groups</li>
              <li>• Leadership training</li>
              <li>• Fellowship & events</li>
            </ul>
          </div>
          <div class="space-y-3">
            <h3 class="font-semibold">Our Vision</h3>
            <p class="text-sm text-muted-foreground">
              To build men of integrity, character, and faith who lead by example, serve with humility, and impact their world for Christ.
            </p>
          </div>
        </div>
      </div>
    `,
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
        date: new Date(Date.UTC(2025, 11, 25, 12, 0, 0)), // December 25, 2025 at noon UTC (avoids timezone boundary issues)
        time: "10:00 AM",
        location: "Main Sanctuary",
        image: { url: "/images/christmas-service-1.webp", alt: "Christmas Service" },
        featured: true,
        content: `
          <div class="space-y-8">
            <p class="text-lg leading-relaxed text-muted-foreground">
              Join us as we celebrate the birth of our Savior, Jesus Christ—a time of joy, reflection, and worship.
            </p>
            
            <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
              <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
              <p class="text-lg font-medium italic mb-2">"For unto us a child is born, unto us a son is given..."</p>
              <p class="text-sm text-muted-foreground">Isaiah 9:6 (KJV)</p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <h3 class="font-semibold">What to Expect</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Inspiring worship & carols</li>
                  <li>• Powerful message</li>
                  <li>• Special performances</li>
                  <li>• Communion service</li>
                </ul>
              </div>
              <div class="space-y-2">
                <h3 class="font-semibold">Reflection</h3>
                <p class="text-sm text-muted-foreground">
                  This celebration reminds us of God's great love—the hope, peace, and eternal life Jesus brings to all who believe.
                </p>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "2",
        slug: "new-year-service",
        title: "New Year Service",
        description: "Start the new year in prayer and worship. Dedicate 2025 to God's purpose.",
        date: new Date("2026-01-01"),
        time: "10:00 PM",
        location: "Main Sanctuary",
        image: { url: "/images/NewYear_service.avif", alt: "New Year Service" },
        featured: true,
        content: `
          <div class="space-y-8">
            <p class="text-lg leading-relaxed text-muted-foreground">
              Begin the new year with purpose and dedication. Join us for prayer, worship, and commitment as we dedicate the year to God's will.
            </p>
            
            <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
              <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
              <p class="text-lg font-medium italic mb-2">"For I know the plans I have for you... plans to give you hope and a future."</p>
              <p class="text-sm text-muted-foreground">Jeremiah 29:11 (NIV)</p>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-3">
                <h3 class="font-semibold">Service Highlights</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Corporate prayer & intercession</li>
                  <li>• Year dedication service</li>
                  <li>• Prophetic word & vision</li>
                  <li>• Testimonies & communion</li>
                </ul>
              </div>
              <div class="space-y-3">
                <h3 class="font-semibold">New Year Commitments</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Seek God first (Matthew 6:33)</li>
                  <li>• Grow in faith (2 Peter 3:18)</li>
                  <li>• Serve with love (Galatians 5:13)</li>
                  <li>• Trust God's plan (Proverbs 3:5-6)</li>
                </ul>
              </div>
            </div>
          </div>
        `,
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
        content: `
          <div class="space-y-8">
            <p class="text-lg leading-relaxed text-muted-foreground">
              Experience the joy of Christmas through beautiful carols, heartfelt worship, and warm fellowship as we celebrate the true meaning of Christmas.
            </p>
            
            <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
              <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
              <p class="text-lg font-medium italic mb-2">"Glory to God in the highest, and on earth peace, good will toward men."</p>
              <p class="text-sm text-muted-foreground">Luke 2:13-14 (KJV)</p>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-3">
                <h3 class="font-semibold">Evening Program</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Traditional & contemporary carols</li>
                  <li>• Special music performances</li>
                  <li>• Scripture readings</li>
                  <li>• Testimonies & fellowship</li>
                </ul>
              </div>
              <div class="space-y-3">
                <h3 class="font-semibold">The Power of Worship</h3>
                <p class="text-sm text-muted-foreground">
                  Christmas carols are declarations of faith and proclamations of the good news. As we sing together, we join the angels in declaring "Glory to God in the highest!"
                </p>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "8",
        slug: "love-feast",
        title: "Love Feast",
        description: "A special time of fellowship, sharing, and breaking bread together as a community.",
        date: new Date("2025-12-21"),
        time: "6:00 PM",
        location: "Fellowship Hall",
        image: { url: "/images/love_feast.avif", alt: "Love Feast" },
        featured: true,
        content: `
          <div class="space-y-8">
            <p class="text-lg leading-relaxed text-muted-foreground">
              Join us for a beautiful time of fellowship where we share a meal, build relationships, and demonstrate Christ's love through unity and mutual encouragement.
            </p>
            
            <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
              <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
              <p class="text-lg font-medium italic mb-2">"And they continued stedfastly in... fellowship, and in breaking of bread..."</p>
              <p class="text-sm text-muted-foreground mb-3">Acts 2:42 (KJV)</p>
              <p class="text-lg font-medium italic mb-2">"By this shall all men know that ye are my disciples, if ye have love one to another."</p>
              <p class="text-sm text-muted-foreground">John 13:35 (KJV)</p>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-3">
                <h3 class="font-semibold">What to Expect</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Shared meal & fellowship</li>
                  <li>• Testimonies & sharing</li>
                  <li>• Prayer & encouragement</li>
                  <li>• Worship & recognition</li>
                </ul>
              </div>
              <div class="space-y-3">
                <h3 class="font-semibold">The Heart of Fellowship</h3>
                <p class="text-sm text-muted-foreground">
                  We are not meant to walk this journey alone. Just as the early church gathered for fellowship, we need the support and love of our church family. This gathering strengthens our bonds and demonstrates that we are Christ's disciples.
                </p>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "9",
        slug: "bible-study-series",
        title: "Bible Study Series",
        description: "Deep dive into God's Word with our weekly Bible study sessions. Meets every other Wednesday at 7:00 PM.",
        date: new Date("2025-01-08"),
        time: "7:00 PM",
        location: "Main Sanctuary",
        image: { url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop&q=80", alt: "Bible Study Series" },
        featured: true,
        content: `
          <div class="space-y-8">
            <p class="text-lg leading-relaxed text-muted-foreground">
              Join us for an in-depth exploration of Scripture. We help you understand God's Word, apply biblical principles to daily life, and grow in your relationship with Christ.
            </p>
            
            <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
              <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
              <p class="text-lg font-medium italic mb-2">"Study to shew thyself approved unto God... rightly dividing the word of truth."</p>
              <p class="text-sm text-muted-foreground mb-3">2 Timothy 2:15 (KJV)</p>
              <p class="text-lg font-medium italic mb-2">"Thy word is a lamp unto my feet, and a light unto my path."</p>
              <p class="text-sm text-muted-foreground">Psalm 119:105 (KJV)</p>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-3">
                <h3 class="font-semibold">Study Format</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Verse-by-verse study</li>
                  <li>• Interactive discussions</li>
                  <li>• Practical application</li>
                  <li>• Prayer & reflection</li>
                </ul>
              </div>
              <div class="space-y-3">
                <h3 class="font-semibold">Why It Matters</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Reveals God's will</li>
                  <li>• Provides wisdom & guidance</li>
                  <li>• Strengthens faith</li>
                  <li>• Transforms thinking (Romans 12:2)</li>
                </ul>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "10",
        slug: "faith-clinic",
        title: "Faith Clinic",
        description: "A place for healing, restoration, and spiritual growth through prayer and the Word. Alternates with Bible Study Series, meets every other Wednesday at 7:00 PM.",
        date: new Date("2025-01-15"),
        time: "7:00 PM",
        location: "Main Sanctuary",
        image: { url: "/images/faith_clinic.avif", alt: "Faith Clinic" },
        featured: true,
        content: `
          <div class="space-y-8">
            <p class="text-lg leading-relaxed text-muted-foreground">
              A dedicated time for healing, restoration, and breakthrough. Through prayer, worship, and God's Word, we seek His intervention for physical, emotional, and spiritual healing.
            </p>
            
            <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
              <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
              <p class="text-lg font-medium italic mb-2">"...with his stripes we are healed."</p>
              <p class="text-sm text-muted-foreground mb-3">Isaiah 53:5 (KJV)</p>
              <p class="text-lg font-medium italic mb-2">"The prayer of faith shall save the sick, and the Lord shall raise him up."</p>
              <p class="text-sm text-muted-foreground">James 5:14-15 (KJV)</p>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-3">
                <h3 class="font-semibold">Service Elements</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Intimate worship & prayer</li>
                  <li>• Teaching on faith & healing</li>
                  <li>• Corporate intercession</li>
                  <li>• Individual prayer & anointing</li>
                </ul>
              </div>
              <div class="space-y-3">
                <h3 class="font-semibold">Our Belief</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• God desires to heal (3 John 1:2)</li>
                  <li>• Power of prayer & faith (Mark 11:24)</li>
                  <li>• Jesus' authority over sickness (Matthew 8:17)</li>
                  <li>• Believe and receive (Mark 5:34)</li>
                </ul>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "11",
        slug: "youth-ministry",
        title: "Youth Ministry",
        description: "Empowering the next generation of believers. Meets every third Sunday of the month at 10:00 AM.",
        date: new Date("2025-01-19"),
        time: "10:00 AM",
        location: "Main Sanctuary",
        image: { url: "/images/youth_activities.avif", alt: "Youth Ministry" },
        featured: true,
        content: `
          <div class="space-y-8">
            <p class="text-lg leading-relaxed text-muted-foreground">
              Empowering the next generation to live boldly for Christ. Through dynamic worship, relevant teaching, and authentic community, we help young people discover their purpose and make an impact.
            </p>
            
            <div class="border-l-4 border-primary bg-primary/5 p-6 rounded-r-lg">
              <h3 class="text-lg font-semibold mb-3 text-primary">Scripture</h3>
              <p class="text-lg font-medium italic mb-2">"Let no man despise thy youth; but be thou an example of the believers..."</p>
              <p class="text-sm text-muted-foreground mb-3">1 Timothy 4:12 (KJV)</p>
              <p class="text-lg font-medium italic mb-2">"Remember now thy Creator in the days of thy youth..."</p>
              <p class="text-sm text-muted-foreground">Ecclesiastes 12:1 (KJV)</p>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="space-y-3">
                <h3 class="font-semibold">What We Offer</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Dynamic worship & praise</li>
                  <li>• Relevant Bible teaching</li>
                  <li>• Small groups & mentorship</li>
                  <li>• Outreach & service projects</li>
                </ul>
              </div>
              <div class="space-y-3">
                <h3 class="font-semibold">Our Vision</h3>
                <ul class="space-y-1.5 text-sm text-muted-foreground">
                  <li>• Equip with biblical foundation</li>
                  <li>• Discover God-given gifts</li>
                  <li>• Create safe, authentic space</li>
                  <li>• Empower as leaders & influencers</li>
                </ul>
              </div>
            </div>
          </div>
        `,
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

