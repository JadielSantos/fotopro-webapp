import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { requireClient } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Verificar se o usuário é cliente e está autenticado
  await requireClient(request);

  // Retornar dados necessários para o dashboard do cliente
  return {
    // Dados do usuário ou outras informações necessárias
  };
}

export default function ClientDashboardPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="client-dashboard">
      <h1 className="text-2xl font-bold mb-6">Meus Álbuns</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Álbuns Compartilhados Comigo</h2>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="p-8 text-center text-gray-500">
            <p>Você ainda não tem acesso a nenhum álbum.</p>
            <p className="mt-2">
              Quando um fotógrafo compartilhar um álbum com você, ele aparecerá aqui.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Minhas Compras</h2>
          <a href="/dashboard/client/purchases" className="text-green-600 hover:text-green-800">
            Ver Todas
          </a>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="p-8 text-center text-gray-500">
            <p>Você ainda não realizou nenhuma compra.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Como Funciona</h2>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Acesse álbuns compartilhados</h3>
              <p className="text-gray-600">
                Quando um fotógrafo compartilhar um álbum com você, você receberá um link de acesso.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Encontre suas fotos facilmente</h3>
              <p className="text-gray-600">
                Nosso sistema agrupa automaticamente as fotos onde você aparece, facilitando a busca.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Selecione e compre suas fotos favoritas</h3>
              <p className="text-gray-600">
                Escolha as fotos que deseja adquirir e complete a compra com facilidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
