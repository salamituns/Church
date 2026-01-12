# Content Data Files

This directory contains JSON files with all website content. Edit these files to update content on the website.

## Files

- **`pastors.json`** - Pastor profiles and bios
- **`ministries.json`** - Ministry information and descriptions
- **`events.json`** - Upcoming events and activities
- **`sermons.json`** - Sermon archive with video/audio links
- **`testimonials.json`** - Member testimonials

## How to Update Content

### For Developers

1. Edit the JSON file you need to update
2. Save the file
3. Restart the dev server (`npm run dev`) or deploy

### For Non-Technical Users

You can edit these files directly in GitHub:

1. Go to the file you want to edit on GitHub
2. Click the pencil icon (✏️) to edit
3. Make your changes
4. Scroll down and click "Commit changes"
5. The website will automatically update (if using Vercel)

## File Format Guidelines

### Dates
- Use ISO 8601 format: `"2025-01-15T00:00:00.000Z"`
- For events, include the full date and time
- Example: `"date": "2025-12-25T12:00:00.000Z"`

### Images
- Use relative paths for local images: `"/images/filename.webp"`
- Or use full URLs for external images: `"https://images.unsplash.com/..."`

### Content (HTML)
- The `content` field can contain HTML
- Use proper HTML tags and classes
- Escape quotes: use `\"` instead of `"`

### Required Fields

**Events:**
- `id`, `slug`, `title`, `description`, `date`
- Optional: `time`, `location`, `image`, `featured`, `content`

**Sermons:**
- `id`, `slug`, `title`, `description`, `date`
- Optional: `speaker`, `series`, `image`, `videoUrl`, `audioUrl`

**Ministries:**
- `id`, `slug`, `title`, `description`, `image`, `category`
- Optional: `content`, `leader`

**Pastors:**
- `id`, `name`, `title`, `image`
- Optional: `bio`

## Examples

### Adding a New Event

```json
{
  "id": "12",
  "slug": "easter-service",
  "title": "Easter Service",
  "description": "Celebrate the resurrection of Jesus Christ.",
  "date": "2025-04-20T10:00:00.000Z",
  "time": "10:00 AM",
  "location": "Main Sanctuary",
  "image": {
    "url": "/images/easter-service.webp",
    "alt": "Easter Service"
  },
  "featured": true
}
```

### Adding a New Sermon

```json
{
  "id": "3",
  "slug": "new-sermon-title",
  "title": "New Sermon Title",
  "description": "Sermon description here.",
  "date": "2025-01-15T00:00:00.000Z",
  "speaker": "Pastor Moses Olise",
  "series": "Series Name",
  "image": {
    "url": "/images/sermon-image.webp",
    "alt": "Sermon Title"
  },
  "videoUrl": "https://youtube.com/watch?v=...",
  "audioUrl": "https://example.com/audio.mp3"
}
```

## Tips

- Always use unique `id` values
- Use kebab-case for `slug` (e.g., `"new-year-service"`)
- Keep descriptions concise (1-2 sentences)
- Use the `featured` flag to highlight important events
- Sort events by date (newest first) for better organization

## Need Help?

If you're unsure about the format, look at existing entries in the files as examples.
