// Contact form email service
// Uses Resend for email delivery

let resend: any = null

// Lazy initialization of Resend client
function getResendClient() {
  if (resend) {
    return resend
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured. Contact form emails will be disabled.')
    return null
  }

  try {
    // Dynamic import to avoid errors if resend is not installed
    const { Resend } = require('resend')
    resend = new Resend(apiKey)
    return resend
  } catch (error) {
    console.warn('Resend package not installed. Run: npm install resend')
    return null
  }
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@yourchurch.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourchurch.com'
const CHURCH_NAME = process.env.NEXT_PUBLIC_CHURCH_NAME || 'Our Church'

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type: 'general' | 'prayer' | 'visitor'
}

export async function sendContactFormEmail(data: ContactFormData) {
  const client = getResendClient()
  if (!client) {
    console.warn('Email service not available. Skipping contact form email.')
    return
  }

  // Determine email subject based on type
  const typeLabels: Record<ContactFormData['type'], string> = {
    general: 'General Inquiry',
    prayer: 'Prayer Request',
    visitor: 'Visitor Information',
  }

  const subjectPrefix = typeLabels[data.type] || 'Contact Form'

  try {
    // Send email to admin
    await client.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `${subjectPrefix}: ${data.subject}`,
      html: `
        <h2>New ${subjectPrefix}</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
        <p><strong>Type:</strong> ${subjectPrefix}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    })

    // Send confirmation email to user
    await client.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Thank you for contacting ${CHURCH_NAME}`,
      html: `
        <h1>Thank You for Reaching Out!</h1>
        <p>Dear ${data.name},</p>
        <p>We have received your ${subjectPrefix.toLowerCase()} and will get back to you as soon as possible.</p>
        <p><strong>Your Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <p>If you have any urgent questions, please feel free to contact us directly.</p>
        <p>Blessings,<br>${CHURCH_NAME} Team</p>
      `,
    })
  } catch (error) {
    console.error('Failed to send contact form email:', error)
    throw error
  }
}
