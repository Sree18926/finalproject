import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'about' }
  | { name: 'detect' }
  | { name: 'contact' }
  | { name: 'admin' };

/** Parse the current location.hash into a route object. */
function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0] || 'home';
  const valid = ['home', 'about', 'detect', 'contact', 'admin'];
  const name = valid.includes(raw) ? (raw as Route['name']) : 'home';
  return { name } as Route;
}

/** Minimal hash-based router (no external dependency). */
export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (name: Route['name']) => {
    window.location.hash = `/${name}`;
  };

  return { route, navigate };
}
