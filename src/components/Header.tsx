
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
    <header 
      className={`fixed transition-all duration-300 ${
        isScrolled 
          ? 'top-24 right-12 transform -rotate-90'
          : 'top-12 left-12'
      }`}
    >
      <div className="relative">
        <h1 className={`font-semibold tracking-wider shadow-black shadow-lg transition-all duration-300 ${
          isScrolled ? 'text-3xl' : 'text-5xl'
        }`}>UMBANDA</h1>
        <span className={`absolute -bottom-6 right-0 text-sm font-light tracking-widest uppercase transition-all duration-300 ${
          isScrolled ? '-rotate-90 -right-6 -bottom-24' : ''
        }`}>
          desde 1908
        </span>
      </div>
    </header>
  );
};

export default Header;
