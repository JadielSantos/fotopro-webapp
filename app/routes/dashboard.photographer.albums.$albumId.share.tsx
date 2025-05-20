import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { ShareAlbumForm } from '~/components/album/ShareAlbumForm';
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
      description: 'Este é um álbum para testar o compartilhamento seguro',
      photoCount: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  };
}

export default function ShareAlbumPage() {
  const { albumId, album } = useLoaderData<typeof loader>();

  return (
    <div className="share-album-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Compartilhar Álbum: {album.title}</h1>
        <p className="text-gray-600">{album.description}</p>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <span>{album.photoCount} fotos</span>
          <span className="mx-2">•</span>
          <span>Criado em {new Date(album.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <ShareAlbumForm
            albumId={albumId}
            onSuccess={(shareUrl) => {
              console.log('Link de compartilhamento criado:', shareUrl);
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Dicas de Compartilhamento Seguro</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Use senhas fortes</h3>
                <p className="text-gray-600">
                  Crie senhas que combinem letras, números e símbolos para maior segurança.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Defina uma data de expiração</h3>
                <p className="text-gray-600">
                  Limite o tempo de acesso ao álbum para aumentar a segurança.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Compartilhe a senha separadamente</h3>
                <p className="text-gray-600">
                  Envie o link e a senha por meios diferentes para maior segurança.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Limite o número de visualizações</h3>
                <p className="text-gray-600">
                  Defina um número máximo de acessos para controlar a exposição.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
