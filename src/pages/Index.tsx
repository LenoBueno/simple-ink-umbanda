import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden animate-fadeIn">
      <Header />
      <Navigation />
      <main className="w-full h-screen flex items-center justify-end px-24">
        <div className="w-[600px] h-[400px]">
          <img 
            src="/imagem.png"
            alt="Descrição da Imagem"
            className="w-full h-full object-cover"
          />
          <div className="w-full h-full flex items-center justify-center text-black/30">
            Imagem Central
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
