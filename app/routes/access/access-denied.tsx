import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { requireAuth } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Verificar se o usuário está autenticado
  await requireAuth(request);

  return {
    message: 'Acesso negado. Você não tem permissão para acessar esta página.'
  };
}

export default function AccessDeniedPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Acesso Negado
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {data.message}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <p className="mb-4">Você pode tentar:</p>
          <div className="space-y-2">
            <a
              href="/"
              className="inline-block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Voltar para a página inicial
            </a>
            <a
              href="/login/photographer"
              className="inline-block w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Login como Fotógrafo
            </a>
            <a
              href="/login/client"
              className="inline-block w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Login como Cliente
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
