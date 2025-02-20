
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "root" && password === "Ftec@148750W559rt") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden animate-fadeIn flex flex-col">
      <Header />
      <Navigation />
      <main className="flex-1 w-full flex items-center justify-center px-24 py-48">
        {!isAuthenticated ? (
          <div className="max-w-md w-full">
            <h2 className="text-3xl font-semibold mb-8 text-center">Login Administrativo</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Usuário
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Entrar
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-4xl w-full">
            <h2 className="text-3xl font-semibold mb-8">Painel Administrativo</h2>
            <div className="grid grid-cols-2 gap-8">
              <div
                onClick={() => navigate("/admin/historia")}
                className="p-6 border rounded cursor-pointer hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">Editar História</h3>
                <p className="text-gray-600">Modifique o conteúdo da página História</p>
              </div>
              <div
                onClick={() => navigate("/admin/pontos")}
                className="p-6 border rounded cursor-pointer hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">Editar Pontos</h3>
                <p className="text-gray-600">Gerencie playlists e pontos de umbanda</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
