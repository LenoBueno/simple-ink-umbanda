
import { useState, useEffect } from "react";
import type { Playlist } from "@/types";
import EditPlaylist from "./EditPlaylist";
import DeletePlaylistConfirm from "./DeletePlaylistConfirm";
import { Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface PlaylistSelectorProps {
  playlists: Playlist[];
  selectedPlaylist: string | null;
  onSelect: (playlistId: string) => void;
  onRefresh?: () => void;
}

const PlaylistSelector = ({ playlists, selectedPlaylist, onSelect, onRefresh }: PlaylistSelectorProps) => {
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [deletingPlaylist, setDeletingPlaylist] = useState<Playlist | null>(null);
  const queryClient = useQueryClient();

  // Reset selected playlist if it was deleted
  useEffect(() => {
    if (selectedPlaylist && !playlists.some(p => p.id === selectedPlaylist)) {
      onSelect("");
    }
  }, [playlists, selectedPlaylist, onSelect]);

  const handleEditClick = (e: React.MouseEvent, playlist: Playlist) => {
    e.stopPropagation();
    setEditingPlaylist(playlist);
  };

  const handleDeleteClick = (e: React.MouseEvent, playlist: Playlist) => {
    e.stopPropagation();
    setDeletingPlaylist(playlist);
  };

  const handleEditSuccess = () => {
    setEditingPlaylist(null);
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
    if (onRefresh) onRefresh();
  };

  const handleDeleteSuccess = () => {
    setDeletingPlaylist(null);
    queryClient.invalidateQueries({ queryKey: ['playlists'] });
    if (onRefresh) onRefresh();
  };

  return (
    <>
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
            
            {/* Botões de ação */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button 
                onClick={(e) => handleEditClick(e, playlist)}
                className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Editar playlist"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={(e) => handleDeleteClick(e, playlist)}
                className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Excluir playlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edição */}
      {editingPlaylist && (
        <EditPlaylist 
          playlist={editingPlaylist}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditingPlaylist(null)}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {deletingPlaylist && (
        <DeletePlaylistConfirm
          playlist={deletingPlaylist}
          onSuccess={handleDeleteSuccess}
          onCancel={() => setDeletingPlaylist(null)}
        />
      )}
    </>
  );
};

export default PlaylistSelector;
