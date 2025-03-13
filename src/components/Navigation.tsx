import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { IonIcon } from '@ionic/react';
import {
  homeOutline,
  playOutline,
  readerOutline,
  settingsOutline,
  reorderFour,
} from 'ionicons/icons';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-12 right-12 z-50 md:right-8 sm:right-4">
      {isScrolled ? (
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 transition-all hover:bg-black/5 rounded-lg"
          >
            <Menu size={24} />
          </button>
          
          {isMenuOpen && (
            <ul className="absolute top-full right-0 mt-2 bg-white py-4 px-6 min-w-[200px] rounded-lg shadow-lg animate-fadeIn">
              <li className="mb-4">
                <Link 
                  to="/" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IonIcon icon={homeOutline} />
                </Link>
              </li>
              <li className="mb-4">
                <Link 
                  to="/pontos" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IonIcon icon={playOutline} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/historia" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IonIcon icon={readerOutline} />
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IonIcon icon={settingsOutline} />
                </Link>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <ul className="flex space-x-12 items-center md:space-x-8 sm:space-x-4">
          <Link to="/" className="nav-link">
            <IonIcon icon={homeOutline} />
          </Link>
          <Link to="/pontos" className="nav-link">
            <IonIcon icon={playOutline} />
          </Link>
          <Link to="/historia" className="nav-link">
            <IonIcon icon={readerOutline} />
          </Link>
          <Link to="/admin" className="nav-link">
            <IonIcon icon={settingsOutline} />
          </Link>

        </ul>
      )}
    </nav>
  );
};

export default Navigation;
