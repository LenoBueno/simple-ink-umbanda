import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className = '',
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden animate-fadeIn flex flex-col">
      <Header />
      <Navigation />
      <main className={`flex-1 w-full ${className}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
