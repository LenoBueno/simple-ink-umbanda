import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { mysql_client } from "@/lib/mysql";
import type { Playlist } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

interface DeletePlaylistConfirmProps {
  playlist: Playlist;
  onSuccess: () => void;
  onCancel: () => void;
}

const DeletePlaylistConfirm = ({ playlist, onSuccess, onCancel }: DeletePlaylistConfirmProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeletePlaylist = async () => {
    setIsDeleting(true);

    try {
      // Primeiro, verificamos se há pontos associados a esta playlist
      const { data: pontos, error: pontosError } = await mysql_client
        .from('pontos')
        .select('*')
        .eq('playlist_id', playlist.id)
        .execute();

      if (pontosError) throw pontosError;

      // Se houver pontos, removemos a associação (não excluímos os pontos)
      if (pontos && pontos.length > 0) {
        for (const ponto of pontos) {
          const { error: updateError } = await mysql_client
            .from('pontos')
            .update({ playlist_id: null })
            .eq('id', ponto.id)
            .execute();

          if (updateError) throw updateError;
        }
      }

      // Agora excluímos a playlist
      const { error: deleteError } = await mysql_client
        .from('playlists')
        .delete()
        .eq('id', playlist.id)
        .execute();

      if (deleteError) throw deleteError;

      // Invalidate the playlists query to force a refetch
      queryClient.invalidateQueries({ queryKey: ['playlists'] });

      toast({
        title: "Sucesso!",
        description: "Playlist excluída com sucesso.",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível excluir a playlist.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Confirmar Exclusão</h3>
        <p className="mb-6">
          Tem certeza que deseja excluir a playlist <strong>{playlist.titulo}</strong>?
          {playlist.num_pontos && playlist.num_pontos > 0 ? (
            <span className="block mt-2 text-red-500">
              Esta playlist contém {playlist.num_pontos} ponto(s). Os pontos serão desassociados, mas não excluídos.
            </span>
          ) : null}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50"
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDeletePlaylist}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlaylistConfirm;