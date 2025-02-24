
import { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1);
    };

    setIsVisible(true);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-12 left-12 z-50 transition-all duration-300">
      <div className="relative">
        <h1 
          className={`text-5xl tracking-wider font-semibold transition-all duration-700 transform ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          } ${isScrolled ? 'text-xl' : 'text-5xl'}`}
        >
          UMBANDA
        </h1>
        <span 
          className={`absolute right-0 bottom-[-1.5rem] font-light tracking-widest uppercase text-sm transition-all duration-700 delay-300 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          } ${isScrolled ? 'text-xs' : 'text-sm'}`}
        >
          desde 1908
        </span>
      </div>
    </header>
  );
};

export default Header;
