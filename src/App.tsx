import { useRouter } from './lib/router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DetectPage } from './pages/DetectPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

/** Root application component — routes between pages. */
function App() {
  const { route, navigate } = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar route={route} navigate={navigate} />

      <main className="flex-1">
        {route.name === 'home' && <HomePage navigate={navigate} />}
        {route.name === 'about' && <AboutPage />}
        {route.name === 'detect' && <DetectPage navigate={navigate} />}
        {route.name === 'contact' && <ContactPage />}
        {route.name === 'admin' && <AdminPage />}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
