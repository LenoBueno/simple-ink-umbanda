import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';

const Index: React.FC = () => {
  return (
    <PageLayout className="min-h-screen flex" showFooter={true}>
      <div className="w-1/2 flex flex-col justify-center px-24 py-16">
        <h1 className="text-4xl font-bold mb-8">Bem-vindo!</h1>
        <p className="text-xl mb-12">Explore a riqueza espiritual e cultural da Umbanda.</p>
        <Link to="/historia">
          <button className="bg-black text-white px-6 py-3 rounded-lg w-48 font-semibold hover:bg-gray-800 transition-colors duration-300">
            Saiba Mais
          </button>
        </Link>
      </div>
      <div className="w-1/2 relative">
        <img 
          src="/imagem.png"
          alt="Descrição da Imagem"
          className="absolute top-48 right-0 w-3/5 object-contain"
        />
      </div>
    </PageLayout>
  );
};

export default Index;
