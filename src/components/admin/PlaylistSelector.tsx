
import type { Playlist } from "@/types";

interface PlaylistSelectorProps {
  playlists: Playlist[];
  selectedPlaylist: string | null;
  onSelect: (playlistId: string) => void;
}

const PlaylistSelector = ({ playlists, selectedPlaylist, onSelect }: PlaylistSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists?.map((playlist) => (
        <div
          key={playlist.id}
          onClick={() => onSelect(playlist.id)}
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
  );
};

export default PlaylistSelector;
