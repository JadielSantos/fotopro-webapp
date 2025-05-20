import { Outlet, useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireClient } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Verificar se o usuário é cliente e está autenticado
  await requireClient(request);

  // Retornar dados necessários para o layout do cliente
  return {
    // Dados do usuário ou outras informações necessárias
  };
}

export default function ClientLayout() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="client-layout">
      <header className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Área do Cliente</h1>
          <nav className="flex space-x-4">
            <a href="/dashboard/client" className="hover:underline">Meus Álbuns</a>
            <a href="/dashboard/client/purchases" className="hover:underline">Compras</a>
            <a href="/dashboard/client/profile" className="hover:underline">Perfil</a>
            <button className="hover:underline">Sair</button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-100 p-4 mt-8">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} - Plataforma de Fotografia</p>
        </div>
      </footer>
    </div>
  );
}
