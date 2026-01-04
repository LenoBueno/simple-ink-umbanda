import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const AudioControls: React.FC<AudioControlsProps> = ({ 
  isPlaying, 
  onTogglePlay, 
  onPrevious, 
  onNext 
}) => {
  return (
    <div className="flex items-center space-x-6">
      <button 
        className="text-gray-700 hover:text-black"
        onClick={onPrevious}
      >
        <SkipBack size={24} />
      </button>
      <button 
        className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800"
        onClick={onTogglePlay}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <button 
        className="text-gray-700 hover:text-black"
        onClick={onNext}
      >
        <SkipForward size={24} />
      </button>
    </div>
  );
};

export default AudioControls;
