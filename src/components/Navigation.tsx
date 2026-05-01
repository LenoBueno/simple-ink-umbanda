import React, { useState, useEffect } from 'react';
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
    <nav className="fixed top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-12 z-50">
      {/* Mobile: always show hamburger. Desktop: show full nav until scrolled */}
      <div className="md:hidden">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            className="p-2 transition-all hover:bg-black/5 rounded-lg bg-white/80 backdrop-blur-sm"
          >
            <Menu size={24} />
          </button>
          {isMenuOpen && (
            <ul className="absolute top-full right-0 mt-2 bg-white py-4 px-6 min-w-[180px] rounded-lg shadow-lg animate-fadeIn">
              <li className="mb-4">
                <Link to="/" className="nav-link flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <IonIcon icon={homeOutline} /> <span className="text-sm">Início</span>
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/pontos" className="nav-link flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <IonIcon icon={playOutline} /> <span className="text-sm">Pontos</span>
                </Link>
              </li>
              <li className="mb-4">
                <Link to="/historia" className="nav-link flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <IonIcon icon={readerOutline} /> <span className="text-sm">História</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="nav-link flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <IonIcon icon={settingsOutline} /> <span className="text-sm">Admin</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="hidden md:block">
      {isScrolled ? (
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
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
        <ul className="flex space-x-8 lg:space-x-12 items-center">
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
      </div>
    </nav>
  );
};

export default Navigation;
