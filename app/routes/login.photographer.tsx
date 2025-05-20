import { type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { LoginForm } from '~/components/auth';
import { UserRole } from '~/models/auth';
import { requireGuest } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Verificar se o usuário já está autenticado
  await requireGuest(request);

  return {};
}

export default function PhotographerLoginPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login de Fotógrafo
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Acesse sua conta para gerenciar seus álbuns e clientes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm
            role={UserRole.PHOTOGRAPHER}
            redirectTo="/dashboard/photographer"
          />
        </div>
      </div>
    </div>
  );
}
