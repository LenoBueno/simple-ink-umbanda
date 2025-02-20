
import { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-12 left-12 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 p-4 rounded opacity-0' : ''}`}>
      <div className="relative">
        <h1 className="text-5xl font-semibold tracking-wider">UMBANDA</h1>
        <span className="absolute -bottom-6 right-0 text-sm font-light tracking-widest uppercase">
          desde 1908
        </span>
      </div>
    </header>
  );
};

export default Header;
