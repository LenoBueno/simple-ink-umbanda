import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { mysql_client } from "@/lib/mysql";
import type { Playlist, Ponto } from "@/types";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface EditPlaylistProps {
  playlist: Playlist;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditPlaylist = ({ playlist, onSuccess, onCancel }: EditPlaylistProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingPontos, setIsLoadingPontos] = useState(true);
  const [titulo, setTitulo] = useState(playlist.titulo);
  const [compositor, setCompositor] = useState(playlist.compositor);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pontos for this playlist
  useEffect(() => {
    const fetchPontos = async () => {
      setIsLoadingPontos(true);
      try {
        const { data, error } = await mysql_client
          .from('pontos')
          .select('*')
          .eq('playlist_id', playlist.id)
          .execute();

        if (error) throw error;
        setPontos(data as Ponto[]);
      } catch (error) {
        toast({
          title: "Erro!",
          description: "Não foi possível carregar os pontos.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPontos(false);
      }
    };

    fetchPontos();
  }, [playlist.id, toast]);

  const handleUpdatePlaylist = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      let imagem_url = playlist.imagem_url;

      // Upload da nova imagem se fornecida
      if (newImage) {
        const imagePath = `playlist-${Date.now()}`;
        const { error: uploadError } = await mysql_client.storage
          .from('imagens')
          .upload(imagePath, newImage);

        if (uploadError) throw uploadError;

        // Get image URL
        const { publicUrl } = mysql_client.storage
          .from('imagens')
          .getPublicUrl(imagePath);

        imagem_url = publicUrl;
      }

      // Update playlist
      const { error: updateError } = await mysql_client
        .from('playlists')
        .update({ titulo, compositor, imagem_url })
        .eq('id', playlist.id)
        .execute();

      if (updateError) throw updateError;

      // Invalidate the playlists query to force a refetch
      queryClient.invalidateQueries({ queryKey: ['playlists'] });

      toast({
        title: "Sucesso!",
        description: "Playlist atualizada com sucesso.",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível atualizar a playlist.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPonto = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const titulo = formData.get('titulo') as string;
    const compositor = formData.get('compositor') as string;
    const audio = formData.get('audio') as File;

    try {
      // Upload do áudio
      const audioPath = `ponto-${Date.now()}`;
      const { error: uploadError } = await mysql_client.storage
        .from('audios')
        .upload(audioPath, audio);

      if (uploadError) throw uploadError;

      // Get audio URL with correct path
      const { publicUrl: audio_url } = mysql_client.storage
        .from('audios')
        .getPublicUrl(audioPath);

      // Ensure the URL points to the correct directory
      const finalAudioUrl = audio_url.replace('/imagens/', '/audios/');


      // Create ponto
      const { error: insertError } = await mysql_client
        .from('pontos')
        .insert({
          playlist_id: playlist.id,
          titulo,
          compositor,
          audio_url: finalAudioUrl
        })
        .execute();

      if (insertError) throw insertError;

      // Invalidate the playlists query to force a refetch
      queryClient.invalidateQueries({ queryKey: ['playlists'] });

      toast({
        title: "Sucesso!",
        description: "Ponto adicionado com sucesso.",
      });

      // Refresh pontos list
      const { data, error } = await mysql_client
        .from('pontos')
        .select('*')
        .eq('playlist_id', playlist.id)
        .execute();

      if (!error && data) {
        setPontos(data as Ponto[]);
      }

      form.reset();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível adicionar o ponto.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePonto = async (pontoId: string) => {
    try {
      const { error } = await mysql_client
        .from('pontos')
        .update({ playlist_id: null })
        .eq('id', pontoId)
        .execute();

      if (error) throw error;

      // Update local state
      setPontos(pontos.filter(p => p.id !== pontoId));

      // Invalidate the playlists query to force a refetch
      queryClient.invalidateQueries({ queryKey: ['playlists'] });

      toast({
        title: "Sucesso!",
        description: "Ponto removido da playlist.",
      });
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível remover o ponto.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg max-w-md w-full my-8">
        <h3 className="text-xl font-semibold mb-6">Editar Playlist</h3>
        <form onSubmit={handleUpdatePlaylist} className="space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium mb-2">
              Título da Playlist
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="compositor" className="block text-sm font-medium mb-2">
              Compositor
            </label>
            <input
              id="compositor"
              type="text"
              value={compositor}
              onChange={(e) => setCompositor(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="imagem" className="block text-sm font-medium mb-2">
              Nova Imagem (opcional)
            </label>
            <input
              id="imagem"
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {isUploading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>

        {/* Pontos da playlist */}
        <div className="mt-8">
          <h4 className="text-lg font-medium mb-4">Pontos da Playlist</h4>
          {isLoadingPontos ? (
            <p className="text-center py-4">Carregando pontos...</p>
          ) : pontos.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pontos.map((ponto) => (
                <div key={ponto.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{ponto.titulo}</p>
                    <p className="text-sm text-gray-500">{ponto.compositor}</p>
                  </div>
                  <button
                    onClick={() => handleRemovePonto(ponto.id)}
                    className="p-1.5 text-red-500 hover:text-red-700"
                    title="Remover ponto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">Nenhum ponto nesta playlist.</p>
          )}
        </div>

        {/* Formulário para adicionar pontos */}
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-4">Adicionar Novo Ponto</h4>
          <form onSubmit={handleAddPonto} className="space-y-4">
            <div>
              <label htmlFor="ponto-titulo" className="block text-sm font-medium mb-2">
                Título do Ponto
              </label>
              <input
                id="ponto-titulo"
                name="titulo"
                type="text"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="ponto-compositor" className="block text-sm font-medium mb-2">
                Compositor
              </label>
              <input
                id="ponto-compositor"
                name="compositor"
                type="text"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="audio" className="block text-sm font-medium mb-2">
                Arquivo de Áudio
              </label>
              <input
                id="audio"
                name="audio"
                type="file"
                accept="audio/*"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              {isUploading ? "Adicionando..." : "Adicionar Ponto"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylist;