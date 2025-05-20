import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { PasswordAccessForm } from '~/components/album/PasswordAccessForm';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    throw new Response('Link de compartilhamento inválido', { status: 400 });
  }

  // Em um ambiente real, buscaríamos informações básicas sobre o link
  // Por enquanto, retornamos apenas o slug
  return {
    slug
  };
}

export default function SharedAlbumAccessPage() {
  const { slug } = useLoaderData<typeof loader>();

  return (
    <div className="shared-album-access-page min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Álbum Compartilhado</h1>
          <p className="text-gray-600 mt-2">
            Acesse fotos compartilhadas por um fotógrafo
          </p>
        </div>

        <PasswordAccessForm />
      </div>
    </div>
  );
}
