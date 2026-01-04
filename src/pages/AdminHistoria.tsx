import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const AdminHistoria = () => {
  const [conteudo, setConteudo] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('historia')
        .upsert({ conteudo });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Conteúdo atualizado com sucesso.",
      });

      navigate('/historia');
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível salvar o conteúdo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden">
      <Header />
      <Navigation />
      <main className="w-full min-h-screen px-6 md:px-24 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Editar História</h2>
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Voltar para o Painel
            </button>
          </div>
          
          <div className="space-y-6">
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              className="w-full h-96 p-4 border rounded-lg resize-none"
              placeholder="Digite o conteúdo da página História aqui..."
            />
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-2 border rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminHistoria;
