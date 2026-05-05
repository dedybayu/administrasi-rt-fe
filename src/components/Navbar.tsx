import { useEffect, useState } from "react"

export default function Navbar() {
  const [theme, setTheme] = useState("auto")

  const applyTheme = (mode) => {
    if (mode === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      )
    } else {
      document.documentElement.setAttribute("data-theme", mode)
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "auto"
    // setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => theme === "auto" && applyTheme("auto")
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [theme])

  const toggleTheme = () => {
    const next =
      theme === "auto" ? "light" : theme === "light" ? "dark" : "auto"

    setTheme(next)
    localStorage.setItem("theme", next)
    applyTheme(next)
  }

  return (

    <div className="drawer">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />

      {/* CONTENT */}
      <div className="drawer-content">
        <div className="navbar fixed top-0 left-0 w-full z-50 bg-base-100 shadow-sm px-4">
          {/* START */}
          <div className="navbar-start">
            {/* MOBILE BUTTON */}
            <label
              htmlFor="mobile-drawer"
              className="btn btn-ghost btn-circle lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            {/* LOGO */}
            <a className="btn btn-ghost text-2xl font-extrabold">
              Gawean
            </a>
          </div>

          {/* DESKTOP MENU */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-6 text-lg font-semibold">
              <li><a href="/#home">Beranda</a></li>
              <li><a href="/#features">Fitur Kami</a></li>
              <li><a href="/#about">Tentang Kami</a></li>
            </ul>
          </div>

          {/* END */}
          <div className="navbar-end gap-2">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle"
              title={`Mode: ${theme}`}
            >
              <ThemeIcon mode={theme} />
            </button>

            <a href="/login">
              <button className="btn btn-primary btn-sm font-semibold hidden sm:inline-flex">
                Mulai
              </button>
            </a>

          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side z-40">
        <label htmlFor="mobile-drawer" className="drawer-overlay"></label>

        <aside className="menu p-6 w-64 min-h-full bg-base-200 text-base-content">
          <h2 className="text-xl font-bold mb-6">Menu</h2>

          <ul className="space-y-2 text-lg font-semibold">
            <li><a href="/#home">Beranda</a></li>
              <li><a href="/#features">Fitur Kami</a></li>
              <li><a href="/#about">Tentang Kami</a></li>
          </ul>

          <a href="/login">
            <button className="btn btn-primary mt-6 w-full">
              Mulai
            </button>
          </a>

        </aside>
      </div>
    </div>
  )


}

/* ---------- SVG ICON ---------- */
function ThemeIcon({ mode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-6 h-6 transition-all duration-500 ${mode === "light"
        ? "rotate-0 scale-110"
        : mode === "dark"
          ? "-rotate-90 scale-110"
          : "animate-pulse"
        }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* LIGHT */}
      {mode === "light" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <g className="origin-center rotate-45">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </>
      )}

      {/* DARK */}
      {mode === "dark" && (
        <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 1019 14.79z" />
      )}

      {/* AUTO = LETTER A */}
      {mode === "auto" && (
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          className="fill-current"
        >
          A
        </text>
      )}
    </svg>
  )
}
