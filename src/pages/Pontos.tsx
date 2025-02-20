
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import type { Playlist, Ponto } from "../types";

const Pontos = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const { data: playlists } = useQuery({
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

  const { data: pontos } = useQuery({
    queryKey: ['pontos', selectedPlaylist],
    queryFn: async () => {
      if (!selectedPlaylist) return [];
      
      const { data, error } = await supabase
        .from('pontos')
        .select('*')
        .eq('playlist_id', selectedPlaylist)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Ponto[];
    },
    enabled: !!selectedPlaylist
  });

  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden">
      <Header />
      <Navigation />
      <main className="w-full min-h-screen px-6 md:px-24 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-24 pt-12">
            <h2 className="text-3xl font-medium uppercase tracking-wide">Pontos de Umbanda</h2>
          </div>
          
          {/* Playlists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-xl font-semibold">{playlist.titulo}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Pontos List */}
          {selectedPlaylist && pontos && (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold mb-6">
                {playlists?.find(p => p.id === selectedPlaylist)?.titulo}
              </h3>
              <div className="space-y-4">
                {pontos.map((ponto) => (
                  <div
                    key={ponto.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <button className="p-2 rounded-full hover:bg-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                    <div>
                      <h4 className="font-semibold">{ponto.titulo}</h4>
                      <p className="text-sm text-gray-600">{ponto.compositor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pontos;
