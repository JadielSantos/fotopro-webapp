import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { requirePhotographer } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Verificar se o usuário é fotógrafo e está autenticado
  await requirePhotographer(request);

  // Retornar dados necessários para o dashboard do fotógrafo
  return {
    // Dados do usuário ou outras informações necessárias
  };
}

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="dashboard">
      <h1 className="text-2xl font-bold mb-6">Dashboard do Fotógrafo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Álbuns</h2>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-gray-500 mt-2">Total de álbuns criados</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Fotos</h2>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-gray-500 mt-2">Total de fotos enviadas</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Vendas</h2>
          <p className="text-3xl font-bold text-green-600">R$ 0,00</p>
          <p className="text-gray-500 mt-2">Total de vendas realizadas</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Álbuns Recentes</h2>
          <a href="/dashboard/photographer/albums/new" className="text-blue-600 hover:text-blue-800">
            + Criar Novo Álbum
          </a>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="p-8 text-center text-gray-500">
            <p>Você ainda não criou nenhum álbum.</p>
            <a href="/dashboard/photographer/albums/new" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Clique aqui para criar seu primeiro álbum
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Atividade Recente</h2>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="p-8 text-center text-gray-500">
            <p>Nenhuma atividade recente para exibir.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
