import { Link } from 'react-router-dom';
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden animate-fadeIn">
      <Header />
      <Navigation />
      <main className="w-full min-h-screen flex">
        <div className="w-1/2 flex flex-col justify-center px-24 py-16">
          {/* Conteúdo do lado esquerdo */}
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
      </main>
      <div className="-mt-24">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
