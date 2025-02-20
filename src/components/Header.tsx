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

  const umbandaText = "UMBANDA";
  const desdeText = "desde 1908";
  
  const renderVerticalText = (text) => {
    return text.split('').map((letter, index) => (
      <span
        key={index}
        className="block"
        style={{ fontSize: isScrolled ? '20px' : 'inherit' }}
      >
        {letter}
      </span>
    ));
  };

  return (
    <header className="fixed top-12 left-12 z-50 transition-all duration-300">
      <div className="relative">
        <h1 className={`tracking-wider font-semibold transition-all duration-300 ${isScrolled ? 'text-[20px]' : 'text-5xl'}`}>
          {isScrolled ? renderVerticalText(umbandaText) : umbandaText}
        </h1>
        <span
          className={`absolute -bottom-5 right-0 font-light tracking-widest uppercase transition-all duration-300 ${isScrolled ? 'text-[10px]' : 'text-sm'}`}
        >
          {isScrolled ? renderVerticalText(desdeText) : desdeText}
        </span>
      </div>
    </header>
  );
};

export default Header;
