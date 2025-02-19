
import Header from "../components/Header";
import Navigation from "../components/Navigation";

const Historia = () => {
  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden animate-fadeIn">
      <Header />
      <Navigation />
      <main className="w-full h-screen flex items-center justify-center px-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-8">História</h2>
          <p className="text-lg">Conteúdo sobre a história da Umbanda será adicionado aqui.</p>
        </div>
      </main>
    </div>
  );
};

export default Historia;
