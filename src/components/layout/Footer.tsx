import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#00264d] text-white pt-12 pb-14 mt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12">
          {/* Column 1: Filters */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-white">Filters</h3>
              <div className="flex items-center gap-4 text-slate-200 text-sm">
                <Link href="/" className="hover:text-blue-300 transition-colors">
                  All
                </Link>
                <Link href="/?category=Electronics" className="hover:text-blue-300 transition-colors tracking-wider font-light">
                  eleezronk
                </Link>
              </div>
            </div>
            <div className="text-slate-300 text-sm pt-4">
              © 2024 American
            </div>
          </div>

          {/* Column 2: About Us */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-white">About Us</h3>
            <ul className="space-y-3 text-slate-200 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-blue-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-white">Follow Us</h3>
            <div className="flex items-center gap-3 pt-1">
              {/* Facebook Icon */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#0066cc] hover:bg-[#0052a3] flex items-center justify-center text-white transition-all shadow-md hover:scale-105"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Twitter / X Icon */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#0066cc] hover:bg-[#0052a3] flex items-center justify-center text-white transition-all shadow-md hover:scale-105"
                aria-label="Twitter"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#0066cc] hover:bg-[#0052a3] flex items-center justify-center text-white transition-all shadow-md hover:scale-105"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
