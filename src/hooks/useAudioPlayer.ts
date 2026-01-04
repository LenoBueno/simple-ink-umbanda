import { useState, useRef, useEffect, useCallback } from 'react';
import type { Ponto } from '@/types';
import { buildAudioUrl, buildAlternativeAudioUrl } from '@/utils/audioUrl';

interface UseAudioPlayerProps {
  pontos: Ponto[];
}

interface UseAudioPlayerReturn {
  audioRef: React.RefObject<HTMLAudioElement>;
  currentPonto: Ponto | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playPonto: (ponto: Ponto) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTimeUpdate: () => void;
  handleEnded: () => void;
  handleLoadedMetadata: () => void;
  handleError: () => void;
}

export const useAudioPlayer = ({ pontos }: UseAudioPlayerProps): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPonto, setCurrentPonto] = useState<Ponto | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentPonto]);

  // Handle audio source change
  useEffect(() => {
    if (currentPonto && audioRef.current) {
      const audioUrl = buildAudioUrl(currentPonto.audio_url);
      console.log('Attempting to play audio:', audioUrl);
      
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        setTimeout(() => {
          if (audioRef.current) {
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error('Audio playback error:', error);
                
                // Try alternative URL
                if (audioRef.current && audioRef.current.src.includes('/audios/')) {
                  const alternativeUrl = buildAlternativeAudioUrl(audioRef.current.src);
                  console.log('Trying alternative URL:', alternativeUrl);
                  audioRef.current.src = alternativeUrl;
                  audioRef.current.load();
                  audioRef.current.play().catch(() => setIsPlaying(false));
                } else {
                  setIsPlaying(false);
                }
              });
            }
          }
        }, 100);
      }
    }
  }, [currentPonto, isPlaying]);

  const playPonto = useCallback((ponto: Ponto) => {
    setCurrentPonto(ponto);
    setCurrentTime(0);
    setIsPlaying(false);
    
    setTimeout(() => {
      if (audioRef.current) {
        setIsPlaying(true);
      }
    }, 200);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentPonto || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Audio playback error:', error);
          setIsPlaying(false);
        });
      }
    }
    setIsPlaying(!isPlaying);
  }, [currentPonto, isPlaying]);

  const playNext = useCallback(() => {
    if (!currentPonto || pontos.length === 0) return;
    
    const currentIndex = pontos.findIndex(p => p.id === currentPonto.id);
    if (currentIndex < pontos.length - 1) {
      playPonto(pontos[currentIndex + 1]);
    }
  }, [currentPonto, pontos, playPonto]);

  const playPrevious = useCallback(() => {
    if (!currentPonto || pontos.length === 0) return;
    
    const currentIndex = pontos.findIndex(p => p.id === currentPonto.id);
    if (currentIndex > 0) {
      playPonto(pontos[currentIndex - 1]);
    }
  }, [currentPonto, pontos, playPonto]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleError = useCallback(() => {
    console.error('Audio element error');
    setIsPlaying(false);
  }, []);

  return {
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
  };
};
