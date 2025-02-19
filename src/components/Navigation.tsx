
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

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
    <nav className="fixed top-12 right-12">
      {isScrolled ? (
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:shadow-lg shadow-black transition-all"
          >
            <Menu size={24} />
          </button>
          
          {isMenuOpen && (
            <ul className="absolute top-full right-0 mt-2 bg-white shadow-black shadow-lg py-4 px-6 min-w-[200px] animate-fadeIn">
              <li className="mb-4">
                <Link 
                  to="/" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="mb-4">
                <Link 
                  to="/pontos" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pontos
                </Link>
              </li>
              <li>
                <Link 
                  to="/historia" 
                  className="nav-link block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  História
                </Link>
              </li>
            </ul>
          )}
        </div>
      ) : (
        <ul className="flex space-x-12 items-center">
          <Link to="/" className="nav-link shadow-black">Home</Link>
          <Link to="/pontos" className="nav-link shadow-black">Pontos</Link>
          <Link to="/historia" className="nav-link shadow-black">História</Link>
        </ul>
      )}
    </nav>
  );
};

export default Navigation;
