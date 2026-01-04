import React from 'react';
import { X, Repeat, List } from 'lucide-react';
import AudioControls from './AudioControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import type { Playlist, Ponto } from '@/types';

interface AudioPlayerProps {
  playlist: Playlist;
  pontos: Ponto[];
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ playlist, pontos, onClose }) => {
  const {
    audioRef,
    currentPonto,
    isPlaying,
    currentTime,
    duration,
    volume,
    playPonto,
    togglePlay,
    playNext,
    playPrevious,
    handleSeek,
    handleVolumeChange,
    handleTimeUpdate,
    handleEnded,
    handleLoadedMetadata,
    handleError,
  } = useAudioPlayer({ pontos });

  // Auto-play first ponto when player opens
  React.useEffect(() => {
    if (pontos.length > 0 && !currentPonto) {
      playPonto(pontos[0]);
    }
  }, [pontos, currentPonto, playPonto]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        preload="auto"
        style={{ display: 'none' }}
      />
      
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-w-[95vw]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img 
              src={playlist.imagem_url} 
              alt={playlist.titulo}
              className="w-20 h-20 rounded-md object-cover"
            />
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">{playlist.titulo}</h3>
              <p className="text-sm text-gray-500">{playlist.subtitulo}</p>
              <span className="text-xs text-gray-400 mt-1">Playing from Playlist</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <AudioControls
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onPrevious={playPrevious}
            onNext={playNext}
          />
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-black">
              <Repeat size={20} />
            </button>
            <VolumeControl
              volume={volume}
              onVolumeChange={handleVolumeChange}
            />
            <button className="text-gray-700 hover:text-black">
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Playlist */}
        <div className="border-t pt-4">
          {pontos.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pontos.map((ponto) => (
                <div 
                  key={ponto.id} 
                  className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer ${
                    currentPonto?.id === ponto.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => playPonto(ponto)}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={playlist.imagem_url} 
                      alt={ponto.titulo} 
                      className="w-10 h-10 rounded object-cover" 
                    />
                    <div>
                      <p className="font-medium">{ponto.titulo}</p>
                      <p className="text-sm text-gray-500">{ponto.compositor}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {currentPonto?.id === ponto.id && isPlaying ? 'Reproduzindo' : ''}
                  </span>
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
  );
};

export default AudioPlayer;
