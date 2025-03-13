
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import CreatePlaylist from "../components/admin/CreatePlaylist";
import PlaylistSelector from "../components/admin/PlaylistSelector";
import PontoForm from "../components/admin/PontoForm";
import { mysql_client } from "../lib/mysql";
import type { Playlist } from "../types";

const AdminPontos = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: playlists, refetch: refetchPlaylists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await mysql_client
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false })
        .execute();
      
      if (error) throw error;
      return data as Playlist[];
    }
  });

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

          <CreatePlaylist onSuccess={refetchPlaylists} />

          <div className="space-y-8">
            <h3 className="text-xl font-semibold">Adicionar Pontos</h3>
            
            <PlaylistSelector
              playlists={playlists || []}
              selectedPlaylist={selectedPlaylist}
              onSelect={setSelectedPlaylist}
              onRefresh={refetchPlaylists}
            />

            {selectedPlaylist && (
              <PontoForm playlistId={selectedPlaylist} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPontos;
