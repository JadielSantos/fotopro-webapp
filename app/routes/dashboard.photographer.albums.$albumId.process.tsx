import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { AlbumProcessing } from '~/components/album/AlbumProcessing';
import { PersonGroups } from '~/components/album/PersonGroups';
import { requirePhotographer } from '~/utils/auth.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
  // Verificar se o usuário é fotógrafo e está autenticado
  await requirePhotographer(request);

  const { albumId } = params;

  if (!albumId) {
    throw new Response('ID do álbum não fornecido', { status: 400 });
  }

  // Em um ambiente real, buscaríamos os dados do álbum do backend
  // Por enquanto, retornamos dados simulados
  return {
    albumId,
    album: {
      id: albumId,
      title: 'Álbum de Teste',
      description: 'Este é um álbum para testar o reconhecimento facial',
      photoCount: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isProcessed: false,
    }
  };
}

export default function AlbumProcessingPage() {
  const { albumId, album } = useLoaderData<typeof loader>();

  return (
    <div className="album-processing-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{album.title}</h1>
        <p className="text-gray-600">{album.description}</p>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <span>{album.photoCount} fotos</span>
          <span className="mx-2">•</span>
          <span>Criado em {new Date(album.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mb-8">
        <AlbumProcessing
          albumId={albumId}
          onProcessingComplete={() => {
            // Recarregar a página ou atualizar os dados
            window.location.reload();
          }}
        />
      </div>

      <div className="mb-8">
        <PersonGroups albumId={albumId} />
      </div>
    </div>
  );
}
