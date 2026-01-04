import { useState, useEffect } from 'react';

interface UseScrollAnimationReturn {
  isScrolled: boolean;
}

/**
 * Hook to detect scroll state
 */
export const useScrollAnimation = (): UseScrollAnimationReturn => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { isScrolled };
};
