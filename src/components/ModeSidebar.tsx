import { useEffect } from "react";
import SunIcon from "./icons/SunIcon";
import MoonIcon from "./icons/MoonIcon";
import AutoIcon from "./icons/AutoIcon";

export default function ModeSidebar({ open, onClose }) {
  const setTheme = (mode) => {
    localStorage.setItem("theme", mode);

    if (mode === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      document.documentElement.classList.toggle("dark", mode === "dark");
    }

    onClose();
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "auto";
    if (saved === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      document.documentElement.classList.toggle("dark", saved === "dark");
    }
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6">
          <h2 className="text-lg font-bold mb-6">Appearance</h2>

          <div className="space-y-4">
            <ModeButton label="Light" onClick={() => setTheme("light")}>
              <SunIcon />
            </ModeButton>

            <ModeButton label="Dark" onClick={() => setTheme("dark")}>
              <MoonIcon />
            </ModeButton>

            <ModeButton label="Auto" onClick={() => setTheme("auto")}>
              <AutoIcon />
            </ModeButton>
          </div>
        </div>
      </aside>
    </>
  );
}

function ModeButton({ label, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
      bg-gray-100 dark:bg-gray-800 hover:scale-[1.02] transition"
    >
      {children}
      <span className="font-semibold">{label}</span>
    </button>
  );
}
