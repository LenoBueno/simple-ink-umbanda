import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { mysql_client } from "../lib/mysql";
import type { Playlist, Ponto } from "../types";
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Repeat, List } from 'lucide-react';

const Pontos = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [playlistPontos, setPlaylistPontos] = useState<Ponto[]>([]);
  const [currentPonto, setCurrentPonto] = useState<Ponto | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    setIsVisible(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: playlists, isLoading } = useQuery({
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

  // Fetch pontos for selected playlist
  useEffect(() => {
    if (selectedPlaylist) {
      const fetchPontos = async () => {
        const { data, error } = await mysql_client
          .from('pontos')
          .select('*')
          .eq('playlist_id', selectedPlaylist.id)
          .execute();
        
        if (!error && data) {
          setPlaylistPontos(data as Ponto[]);
        }
      };
      
      fetchPontos();
    }
  }, [selectedPlaylist]);

  const handleFollow = (playlistId: string) => {
    console.log("Seguir playlist:", playlistId);
  };

  // Função para reproduzir uma playlist
  const handlePlay = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    
    // Buscar os pontos da playlist e iniciar a reprodução do primeiro ponto
    const fetchPontosAndPlay = async () => {
      const { data, error } = await mysql_client
        .from('pontos')
        .select('*')
        .eq('playlist_id', playlist.id)
        .execute();
      
      if (!error && data && data.length > 0) {
        const pontos = data as Ponto[];
        setPlaylistPontos(pontos);
        // Reproduzir o primeiro ponto automaticamente
        playPonto(pontos[0]);
      }
    };
    
    fetchPontosAndPlay();
  };

  // Função para formatar o tempo em minutos:segundos
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Atualizar o tempo atual durante a reprodução
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Manipular o fim da reprodução
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Manipular o carregamento dos metadados do áudio
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Controlar a reprodução (play/pause)
  const togglePlay = () => {
    if (!currentPonto) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Controlar o volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Controlar a posição da reprodução
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  // Reproduzir um ponto específico
  const playPonto = (ponto: Ponto) => {
    setCurrentPonto(ponto);
    setCurrentTime(0);
    setIsPlaying(true);
    
    // Aguardar o próximo ciclo para garantir que o audioRef foi atualizado
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  // Atualizar o volume do áudio quando o componente é montado ou quando o volume é alterado
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentPonto]);

  // Efeito para atualizar o áudio quando o ponto atual muda
  useEffect(() => {
    if (currentPonto && audioRef.current) {
      // Quando o src do áudio muda, o navegador automaticamente carrega o novo áudio
      // Após o carregamento, o evento onLoadedMetadata será disparado
      
      // Verificar se a URL do áudio está correta
      let audioUrl = currentPonto.audio_url;
      
      // Corrigir a URL do áudio para apontar para o caminho correto da API
      if (!audioUrl.startsWith('http')) {
        // Se não for uma URL completa, adicionar o prefixo da API
        if (audioUrl.startsWith('/')) {
          audioUrl = `http://localhost:3000${audioUrl}`;
        } else {
          audioUrl = `http://localhost:3000/api/files/${audioUrl}`;
        }
      }
      
      // Verificar se o áudio está na pasta de imagens (erro comum) ou na pasta de áudios
      if (audioUrl.includes('/imagens/')) {
        // Se estiver na pasta de imagens, manter o caminho original
        // Apenas garantir que a URL base esteja correta
        if (!audioUrl.startsWith('http')) {
          audioUrl = `http://localhost:3000${audioUrl}`;
        }
      } else if (!audioUrl.includes('/audios/')) {
        // Se não estiver em nenhuma pasta específica, tentar na pasta de áudios
        const fileName = audioUrl.split('/').pop();
        audioUrl = `http://localhost:3000/api/files/audios/${fileName}`;
        
        // Se o arquivo não existir na pasta de áudios, tentar na pasta de imagens
        // (isso será tratado pelo catch do playPromise se falhar)
      }
      
      console.log('Tentando reproduzir áudio:', audioUrl);
      audioRef.current.src = audioUrl;
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        
        // Tratamento de erro para reprodução de áudio (necessário para alguns navegadores)
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Erro ao reproduzir áudio:", error);
            console.log("URL do áudio que falhou:", audioRef.current.src);
            
            // Tentar reproduzir da pasta de imagens se falhar na pasta de áudios
            if (audioRef.current.src.includes('/audios/')) {
              const fileName = audioRef.current.src.split('/').pop();
              const newUrl = `http://localhost:3000/api/files/imagens/${fileName}`;
              console.log("Tentando URL alternativa:", newUrl);
              audioRef.current.src = newUrl;
              audioRef.current.play().catch(err => {
                console.error("Erro ao reproduzir áudio (segunda tentativa):", err);
                setIsPlaying(false);
              });
            } else {
              setIsPlaying(false);
            }
          });
        }
      }
    }
  }, [currentPonto, isPlaying]);

  // Próximo ponto
  const playNextPonto = () => {
    if (!currentPonto || playlistPontos.length === 0) return;
    
    const currentIndex = playlistPontos.findIndex(p => p.id === currentPonto.id);
    if (currentIndex < playlistPontos.length - 1) {
      playPonto(playlistPontos[currentIndex + 1]);
    }
  };

  // Ponto anterior
  const playPreviousPonto = () => {
    if (!currentPonto || playlistPontos.length === 0) return;
    
    const currentIndex = playlistPontos.findIndex(p => p.id === currentPonto.id);
    if (currentIndex > 0) {
      playPonto(playlistPontos[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[] relative overflow-hidden">
      <Header />
      <Navigation />
      <div className="fixed top-36 right-24 z-50 md:top-25 sm:right-10 xs:right-6">
        <h2 className={`text-black text-3xl font-medium uppercase tracking-wide transition-all duration-700`}>
          {/* Pontos de Umbanda - Removido */}
        </h2>
      </div>
      
      {/* Elemento de áudio oculto */}
      <audio
        ref={audioRef}
        src={currentPonto?.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        style={{ display: 'none' }}
      />
      <main className="w-full min-h-screen p-6 md:p-25 pt-72 mt-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Carregando playlists...</p>
          </div>
        ) : playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 max-w-[1800px] mx-auto">
            {playlists.map((playlist) => (
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
                        {playlist.num_pontos || 0}
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
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-xl mb-4">Nenhuma playlist disponível no momento.</p>
            <p className="text-gray-500">As novas playlists aparecerão aqui quando forem adicionadas.</p>
          </div>
        )}

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
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, black ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <button 
                    className="text-gray-700 hover:text-black"
                    onClick={playPreviousPonto}
                  >
                    <SkipBack size={24} />
                  </button>
                  <button 
                    className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button 
                    className="text-gray-700 hover:text-black"
                    onClick={playNextPonto}
                  >
                    <SkipForward size={24} />
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-700 hover:text-black">
                    <Repeat size={20} />
                  </button>
                  <div className="flex items-center space-x-2">
                    <Volume2 size={20} className="text-gray-700" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, black ${volume * 100}%, #e5e7eb ${volume * 100}%)`
                      }}
                    />
                  </div>
                  <button className="text-gray-700 hover:text-black">
                    <List size={20} />
                  </button>
                </div>
              </div>

              {/* Playlist */}
              <div className="border-t pt-4">
                {playlistPontos.length > 0 ? (
                  <div className="space-y-2">
                    {playlistPontos.map((ponto) => (
                      <div 
                        key={ponto.id} 
                        className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer ${currentPonto?.id === ponto.id ? 'bg-gray-100' : ''}`}
                        onClick={() => playPonto(ponto)}
                      >
                        <div className="flex items-center space-x-3">
                          <img src={selectedPlaylist.imagem_url} alt={ponto.titulo} className="w-10 h-10 rounded object-cover" />
                          <div>
                            <p className="font-medium">{ponto.titulo}</p>
                            <p className="text-sm text-gray-500">{ponto.compositor}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{currentPonto?.id === ponto.id && isPlaying ? 'Reproduzindo' : ''}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-gray-500">Nenhum ponto disponível nesta playlist.</p>
                  </div>
                )}
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

        .card .imgBx {
          position: absolute;
          left: 50%;
          top: -50px;
          transform: translateX(-50%);
          width: 150px;
          height: 150px;
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          transition: 0.5s;
        }

        .card:hover .imgBx {
          width: 250px;
          height: 250px;
        }

        .card .imgBx img {
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
          color: #555;
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
          color: #555;
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
          background: #000000;
          color: #FFFFFF;
          cursor: pointer;
        }

        .card .content .details .actionBtn button:nth-child(2) {
          border: 1px solid #999;
          color: #999;
          background: #FFFFFF;
        }
        `}
      </style>
    </div>
  );
};

export default Pontos;
