import React, { useEffect, useState } from 'react';

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
    <header className="fixed top-4 left-4 sm:top-8 sm:left-8 md:top-12 md:left-12 z-50 transition-all duration-300">
      <div className="relative">
        <h1 className={`tracking-wider font-semibold transition-all duration-700 ${
          isScrolled ? 'text-lg sm:text-xl' : 'text-3xl sm:text-4xl md:text-5xl'
        }`}>
          UMBANDA
        </h1>
        <span className={`absolute right-0 font-light tracking-widest uppercase transition-all duration-700 ${
          isScrolled ? 'text-[10px] sm:text-xs' : 'text-[10px] sm:text-xs md:text-sm'
        }`}>
          desde 1908
        </span>
      </div>
    </header>
  );
};

export default Header;
