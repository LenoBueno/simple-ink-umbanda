
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
    <div className="min-h-screen w-full bg-[] relative overflow-hidden">
      <Header />
      <Navigation />
      <div className="fixed top-36 right-24 z-50 md:top-25 sm:right-10 xs:right-6">
        <h2 
          className={`text-black text-3xl font-medium uppercase tracking-wide transition-all duration-700 ${
            isScrolled ? 'text-xl' : 'text-3xl'
          }`}
        >
          Pontos de Umbanda
        </h2>
      </div>
      <main className="w-full min-h-screen p-6 md:p-25 pt-72 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 max-w-[1800px] mx-auto">
          {playlists?.map((playlist) => (
            <div key={playlist.id} className="card">
              <div className="imgBx">
                <img
                  src={playlist.imagem_url}
                  alt={playlist.titulo}
                />
              </div>
              <div className="content">
                <div className="details">
                  <h2>{playlist.titulo}<br /><span>{playlist.subtitulo}</span></h2>
                  <div className="data">
                    <h3>
                      {mockPontos.filter(p => p.playlist_id === playlist.id).length}
                      <br />
                      <span>Pontos</span>
                    </h3>
                    <h3>
                      {playlist.num_followers || 0}
                      <br />
                      <span>Seguidores</span>
                    </h3>
                    <h3>
                      {playlist.num_downloads || 0}
                      <br />
                      <span>Downloads</span>
                    </h3>
                  </div>
                  <div className="actionBtn">
                    <button onClick={() => handleFollow(playlist.id)}>
                      Seguir
                    </button>
                    <button onClick={() => handlePlay(playlist)}>
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

      <style>
        {`
        .card {
          position: relative;
          width: 350px;
          height: 190px;
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
          transition: 0.5s;
        }

        .card:hover {
          height: 450px;
        }

        .imgBx {
          position: absolute;
          left: 50%;
          top: -50px;
          transform: translateX(-50%);
          width: 150px;
          height: 150px;
          background-color: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          transition: 0.5s;
        }

        .card:hover .imgBx {
          width: 200px;
          height: 200px;
        }

        .imgBx img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card .content {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          overflow: hidden;
        }

        .card .content .details {
          padding: 40px;
          text-align: center;
          width: 100%;
          transition: 0.5s;
          transform: translateY(150px);
        }

        .card:hover .content .details {
          transform: translateY(0px);
        }

        .card .content .details h2 {
          font-size: 1.25em;
          font-weight: 600;
          color: #403E43;
          line-height: 1.2em;
        }

        .card .content .details h2 span {
          font-size: 0.75em;
          font-weight: 500;
          opacity: 0.5;
        }

        .card .content .details .data {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
        }

        .card .content .details .data h3 {
          font-size: 1em;
          color: #403E43;
          line-height: 1.2em;
          font-weight: 600;
        }

        .card .content .details .data h3 span {
          font-size: 0.85em;
          font-weight: 400;
          opacity: 0.5;
        }

        .card .content .details .actionBtn {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .card .content .details .actionBtn button {
          padding: 10px 30px;
          border-radius: 5px;
          border: none;
          outline: none;
          font-size: 1em;
          font-weight: 500;
          background: #403E43;
          color: #FFFFFF;
          cursor: pointer;
          transition: 0.3s;
        }

        .card .content .details .actionBtn button:hover {
          background: #8A898C;
        }

        .card .content .details .actionBtn button:nth-child(2) {
          border: 1px solid #403E43;
          color: #403E43;
          background: #FFFFFF;
        }

        .card .content .details .actionBtn button:nth-child(2):hover {
          background: #F2FCE2;
        }
        `}
      </style>
    </div>
  );
};

export default Pontos;
