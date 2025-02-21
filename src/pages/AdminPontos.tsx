
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { Playlist, Ponto } from "../types";

const AdminPontos = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: playlists, refetch: refetchPlaylists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Playlist[];
    }
  });

  const handleCreatePlaylist = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const titulo = formData.get('titulo') as string;
    const compositor = formData.get('compositor') as string;
    const imagem = formData.get('imagem') as File;

    try {
      // Upload da imagem
      const imagePath = `playlist-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(imagePath, imagem);

      if (uploadError) throw uploadError;

      // Get image URL
      const { data: { publicUrl: imagem_url } } = supabase.storage
        .from('imagens')
        .getPublicUrl(imagePath);

      // Create playlist
      const { error: insertError } = await supabase
        .from('playlists')
        .insert({ titulo, compositor, imagem_url });

      if (insertError) throw insertError;

      toast({
        title: "Sucesso!",
        description: "Playlist criada com sucesso.",
      });

      form.reset();
      refetchPlaylists();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível criar a playlist.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPonto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPlaylist) return;
    setIsUploading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const titulo = formData.get('titulo') as string;
    const compositor = formData.get('compositor') as string;
    const audio = formData.get('audio') as File;

    try {
      // Upload do áudio
      const audioPath = `ponto-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('audios')
        .upload(audioPath, audio);

      if (uploadError) throw uploadError;

      // Get audio URL
      const { data: { publicUrl: audio_url } } = supabase.storage
        .from('audios')
        .getPublicUrl(audioPath);

      // Create ponto
      const { error: insertError } = await supabase
        .from('pontos')
        .insert({
          playlist_id: selectedPlaylist,
          titulo,
          compositor,
          audio_url
        });

      if (insertError) throw insertError;

      toast({
        title: "Sucesso!",
        description: "Ponto adicionado com sucesso.",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível adicionar o ponto.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden">
      <Header />
      <Navigation />
      <main className="w-full min-h-screen px-6 md:px-24 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Gerenciar Pontos</h2>
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Voltar para o Painel
            </button>
          </div>

          {/* Criar Playlist */}
          <div className="mb-12 p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-6">Criar Nova Playlist</h3>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium mb-2">
                  Título da Playlist
                </label>
                <input
                  id="titulo"
                  name="titulo"
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="compositor" className="block text-sm font-medium mb-2">
                  Compositor
                </label>
                <input
                  id="compositor"
                  name="compositor"
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="imagem" className="block text-sm font-medium mb-2">
                  Imagem
                </label>
                <input
                  id="imagem"
                  name="imagem"
                  type="file"
                  accept="image/*"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {isUploading ? "Criando..." : "Criar Playlist"}
              </button>
            </form>
          </div>

          {/* Adicionar Pontos */}
          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Adicionar Pontos</h3>
            
            {/* Selecionar Playlist */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists?.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => setSelectedPlaylist(playlist.id)}
                  className={`relative overflow-hidden rounded-lg cursor-pointer transition-all
                    ${selectedPlaylist === playlist.id ? 'ring-2 ring-black' : 'hover:scale-105'}`}
                >
                  <img
                    src={playlist.imagem_url}
                    alt={playlist.titulo}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                    <h4 className="text-white font-semibold">{playlist.titulo}</h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulário de Pontos */}
            {selectedPlaylist && (
              <form onSubmit={handleAddPonto} className="space-y-4 p-6 border rounded-lg">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium mb-2">
                    Título do Ponto
                  </label>
                  <input
                    id="titulo"
                    name="titulo"
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label htmlFor="compositor" className="block text-sm font-medium mb-2">
                    Compositor
                  </label>
                  <input
                    id="compositor"
                    name="compositor"
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label htmlFor="audio" className="block text-sm font-medium mb-2">
                    Arquivo de Áudio
                  </label>
                  <input
                    id="audio"
                    name="audio"
                    type="file"
                    accept="audio/*"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                >
                  {isUploading ? "Adicionando..." : "Adicionar Ponto"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPontos;

