import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';

const Index: React.FC = () => {
  return (
    <PageLayout className="min-h-screen flex flex-col md:flex-row" showFooter={true}>
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 pt-32 pb-12 md:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 md:mb-8">Bem-vindo!</h1>
        <p className="text-lg sm:text-xl mb-8 md:mb-12">Explore a riqueza espiritual e cultural da Umbanda.</p>
        <Link to="/historia">
          <button className="bg-black text-white px-6 py-3 rounded-lg w-full sm:w-48 font-semibold hover:bg-gray-800 transition-colors duration-300">
            Saiba Mais
          </button>
        </Link>
      </div>
      <div className="w-full md:w-1/2 relative min-h-[280px] md:min-h-0">
        <img
          src="/imagem.png"
          alt="Ilustração Umbanda"
          loading="lazy"
          className="md:absolute md:top-48 md:right-0 w-3/4 sm:w-1/2 md:w-3/5 object-contain mx-auto md:mx-0"
        />
      </div>
    </PageLayout>
  );
};

export default Index;
