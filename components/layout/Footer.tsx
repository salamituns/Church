import Link from "next/link"
import { Facebook, Instagram, Youtube, Music } from "lucide-react"

export function Footer() {
  return (
    <footer 
      className="border-t border-gray-800 bg-slate-900 text-gray-300"
      role="contentinfo"
    >
      <div className="container py-6 sm:py-8 md:py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-white">RCCG Shiloh Mega Parish</h3>
            <p className="text-xs sm:text-sm text-gray-400">
              "A place to belong, grow, and serve."
            </p>
            <div className="text-xs sm:text-sm text-gray-400 space-y-0.5 sm:space-y-1">
              <p>10130 Belknap Rd, Sugar Land, TX 77478</p>
              <p><a href="tel:281-840-1614" className="hover:text-primary transition-colors">(281) 840-1614</a></p>
              <p><a href="mailto:churchoffice@rccgshilohmega.org" className="hover:text-primary break-all transition-colors">churchoffice@rccgshilohmega.org</a></p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:contents">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-semibold text-white">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/ministries" className="text-gray-400 hover:text-primary transition-colors">
                    Ministries
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-gray-400 hover:text-primary transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/visit" className="text-gray-400 hover:text-primary transition-colors">
                    Visit Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-semibold text-white">Connect</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/sermons" className="text-gray-400 hover:text-primary transition-colors">
                    Sermons
                  </Link>
                </li>
                <li>
                  <Link href="/give" className="text-gray-400 hover:text-primary transition-colors">
                    Give
                  </Link>
                </li>
                <li>
                  <Link href="/visit" className="text-gray-400 hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center sm:text-left">
            <h4 className="text-xs sm:text-sm font-semibold text-white">Follow Us</h4>
            <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start">
              <a
                href="https://www.facebook.com/share/17mTv7kDSU/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5] hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://www.instagram.com/shilohmegaparish?igsh=MW9yb3JtN3JsbnU2eQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:opacity-90 hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://youtube.com/@rccgshilohmega?si=khEGz7UwOhEIYl-2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#FF0000] text-white hover:bg-[#CC0000] hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="https://open.spotify.com/show/37G6a2sMTd37GtARDJXQZt?si=yWhua7o3RQmCoGJ5zTzsTQ"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#1DB954] text-white hover:bg-[#1ed760] hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Spotify Podcast"
              >
                <Music className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 md:mt-8 border-t border-gray-800 pt-4 sm:pt-6 md:pt-8 text-center text-xs sm:text-sm text-gray-400 space-y-1">
          <p>© {new Date().getFullYear()} RCCG SHILOH MEGA PARISH</p>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

