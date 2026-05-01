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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
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
      
      <div className="bg-white p-4 sm:p-6 rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:w-[500px] sm:max-w-[95vw] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 sm:mb-6 gap-2">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <img 
              src={playlist.imagem_url} 
              alt={playlist.titulo}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <h3 className="text-base sm:text-xl font-bold truncate">{playlist.titulo}</h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{playlist.subtitulo}</p>
              <span className="text-[10px] sm:text-xs text-gray-400 mt-1">Playing from Playlist</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-gray-500 hover:text-black p-2 -m-2 flex-shrink-0"
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
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <AudioControls
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onPrevious={playPrevious}
            onNext={playNext}
          />
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button aria-label="Repetir" className="text-gray-700 hover:text-black p-1">
              <Repeat size={20} />
            </button>
            <div className="hidden sm:block">
              <VolumeControl
                volume={volume}
                onVolumeChange={handleVolumeChange}
              />
            </div>
            <button aria-label="Lista" className="text-gray-700 hover:text-black p-1">
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
