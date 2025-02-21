
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { Playlist } from "@/types";

interface CreatePlaylistProps {
  onSuccess: () => void;
}

const CreatePlaylist = ({ onSuccess }: CreatePlaylistProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleCreatePlaylist = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const titulo = formData.get('titulo') as string;
    const compositor = formData.get('compositor') as string;
    const imagem = formData.get('imagem') as File;

    try {
      // Upload da imagem
      const imagePath = `playlist-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('imagens')
        .upload(imagePath, imagem);

      if (uploadError) throw uploadError;

      // Get image URL
      const { data: { publicUrl: imagem_url } } = supabase.storage
        .from('imagens')
        .getPublicUrl(imagePath);

      // Create playlist
      const { error: insertError } = await supabase
        .from('playlists')
        .insert({ titulo, compositor, imagem_url });

      if (insertError) throw insertError;

      toast({
        title: "Sucesso!",
        description: "Playlist criada com sucesso.",
      });

      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível criar a playlist.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-12 p-6 border rounded-lg">
      <h3 className="text-xl font-semibold mb-6">Criar Nova Playlist</h3>
      <form onSubmit={handleCreatePlaylist} className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium mb-2">
            Título da Playlist
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="compositor" className="block text-sm font-medium mb-2">
            Compositor
          </label>
          <input
            id="compositor"
            name="compositor"
            type="text"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="imagem" className="block text-sm font-medium mb-2">
            Imagem
          </label>
          <input
            id="imagem"
            name="imagem"
            type="file"
            accept="image/*"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isUploading ? "Criando..." : "Criar Playlist"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylist;
