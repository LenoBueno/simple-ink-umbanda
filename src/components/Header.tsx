
import { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-12 left-12 z-50 transition-all duration-300">
      <div className="relative">
        <h1 className={`text-5xl tracking-wider font-semibold transition-all duration-300 ${
          isScrolled ? 'text-xl' : 'text-5xl'
        }`}>
          UMBANDA
        </h1>
        <span className={`absolute right-0 bottom-[-1.5rem] font-light tracking-widest uppercase text-sm transition-all duration-300 ${
          isScrolled ? 'text-xs' : 'text-sm'
        }`}>
          desde 1908
        </span>
      </div>
    </header>
  );
};

export default Header;
