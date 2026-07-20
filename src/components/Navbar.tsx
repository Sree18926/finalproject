import { Moon, Sun, Newspaper, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../lib/theme';
import type { Route } from '../lib/router';

type NavItem = { label: string; route: Route['name'] };

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', route: 'home' },
  { label: 'About', route: 'about' },
  { label: 'Detect', route: 'detect' },
  { label: 'Contact', route: 'contact' },
  { label: 'Admin', route: 'admin' },
];

/** Top navigation bar with logo, links, theme toggle, and mobile menu. */
export function Navbar({ route, navigate }: { route: Route; navigate: (r: Route['name']) => void }) {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const go = (r: Route['name']) => {
    navigate(r);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
      <nav className="container-page flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2.5 group"
          aria-label="Go to home"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-md group-hover:scale-105 transition-transform">
            <Newspaper className="w-5 h-5" />
          </span>
          <span className="font-semibold text-lg tracking-tight">
            Fake<span className="gradient-text">News</span> AI
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = route.name === item.route;
            return (
              <li key={item.route}>
                <button
                  onClick={() => go(item.route)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-500" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden p-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <ul className="container-page py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = route.name === item.route;
              return (
                <li key={item.route}>
                  <button
                    onClick={() => go(item.route)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
