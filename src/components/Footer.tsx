import { Newspaper, Github, Mail, ShieldCheck } from 'lucide-react';
import type { Route } from '../lib/router';

/** Site footer with brand, quick links, and credits. */
export function Footer({ navigate }: { navigate: (r: Route['name']) => void }) {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container-page py-12 grid gap-8 md:grid-cols-4">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white">
              <Newspaper className="w-5 h-5" />
            </span>
            <span className="font-semibold text-lg">FakeNews AI</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
            A machine learning powered system that classifies news articles as
            real or fake using TF-IDF features and Logistic Regression.
          </p>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> B.Sc. Computer Science Final Year Project
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Navigate</h4>
          <ul className="space-y-2 text-sm">
            {(['home', 'about', 'detect', 'contact', 'admin'] as const).map((r) => (
              <li key={r}>
                <button
                  onClick={() => navigate(r)}
                  className="text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 capitalize transition-colors"
                >
                  {r === 'detect' ? 'Detect News' : r}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Built With</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>Python · Flask</li>
            <li>Scikit-learn · NLTK</li>
            <li>React · Tailwind CSS</li>
          </ul>
          <div className="flex items-center gap-3 mt-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-500 transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="mailto:contact@fakenewsai.example" className="text-gray-400 hover:text-brand-500 transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 py-5 text-center text-xs text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} FakeNews AI — Final Year Project. For educational purposes.
      </div>
    </footer>
  );
}
