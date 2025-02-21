
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import type { Playlist, Ponto } from "../types";
import { mockPlaylists, mockPontos } from "../data/mockData";
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Repeat, List } from 'lucide-react';

const Pontos = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    setIsVisible(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: playlists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      return mockPlaylists;
    }
  });

  const handleFollow = (playlistId: string) => {
    console.log("Seguir playlist:", playlistId);
  };

  const handlePlay = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  return (
    <div className="min-h-screen w-full bg-white text-black relative overflow-hidden">
      <Header />
      <Navigation />
      <div className="fixed top-36 right-24 z-50 md:top-36 sm:right-12 xs:right-6">
        <h2 
          className={`text-3xl font-medium uppercase tracking-wide transition-all duration-700 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          Pontos de Umbanda
        </h2>
      </div>
      <main className="w-full min-h-screen p-6 md:p-24 pt-48 mt-12">
        <div className="grid grid-cols-5 gap-6 max-w-[1800px] mx-auto">
          {playlists?.map((playlist) => (
            <div
              key={playlist.id}
              className="relative w-full h-[140px] bg-white rounded-lg shadow-lg transition-all duration-500 hover:h-[280px] group"
            >
              {/* Imagem */}
              <div className="absolute left-1/2 -top-[30px] -translate-x-1/2 w-[100px] h-[100px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 group-hover:w-[140px] group-hover:h-[140px]">
                <img
                  src={playlist.imagem_url}
                  alt={playlist.titulo}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Conteúdo */}
              <div className="absolute inset-0 flex justify-center items-end overflow-hidden">
                <div className="p-4 text-center w-full transition-transform duration-500 translate-y-[80px] group-hover:translate-y-0">
                  <h2 className="text-lg font-semibold text-black">{playlist.titulo}</h2>
                  <span className="text-sm text-gray-500">{playlist.subtitulo}</span>

                  <div className="flex justify-between my-4">
                    <div className="text-center">
                      <h3 className="font-semibold">{mockPontos.filter(p => p.playlist_id === playlist.id).length}</h3>
                      <span className="text-sm text-gray-500">Pontos</span>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{playlist.num_followers || 0}</h3>
                      <span className="text-sm text-gray-500">Seguidores</span>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{playlist.num_downloads || 0}</h3>
                      <span className="text-sm text-gray-500">Downloads</span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 space-x-2">
                    <button
                      onClick={() => handleFollow(playlist.id)}
                      className="px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Seguir
                    </button>
                    <button
                      onClick={() => handlePlay(playlist)}
                      className="px-3 py-1.5 border border-black text-black text-sm rounded-md hover:bg-gray-100 transition-colors"
                    >
                      Reproduzir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Player inline */}
        {selectedPlaylist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-w-[95vw]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedPlaylist.imagem_url} 
                    alt={selectedPlaylist.titulo}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold">{selectedPlaylist.titulo}</h3>
                    <p className="text-sm text-gray-500">{selectedPlaylist.subtitulo}</p>
                    <span className="text-xs text-gray-400 mt-1">Playing from Playlist</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlaylist(null)}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="h-1 w-full bg-gray-200 rounded-full">
                  <div className="h-1 w-1/3 bg-black rounded-full"></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1:20</span>
                  <span>3:45</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <button className="text-gray-700 hover:text-black">
                    <SkipBack size={24} />
                  </button>
                  <button 
                    className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button className="text-gray-700 hover:text-black">
                    <SkipForward size={24} />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-700 hover:text-black">
                    <Repeat size={20} />
                  </button>
                  <div className="flex items-center space-x-2">
                    <Volume2 size={20} className="text-gray-700" />
                    <div className="w-24 h-1 bg-gray-200 rounded-full">
                      <div className="h-1 w-2/3 bg-black rounded-full"></div>
                    </div>
                  </div>
                  <button className="text-gray-700 hover:text-black">
                    <List size={20} />
                  </button>
                </div>
              </div>

              {/* Playlist */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  {mockPontos.slice(0, 5).map((ponto) => (
                    <div key={ponto.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <img src={selectedPlaylist.imagem_url} alt={ponto.titulo} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="font-medium">{ponto.titulo}</p>
                          <p className="text-sm text-gray-500">{selectedPlaylist.titulo}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">3:45</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Pontos;
