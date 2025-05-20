import { Outlet, useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requirePhotographer } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Verificar se o usuário é fotógrafo e está autenticado
  await requirePhotographer(request);

  // Retornar dados necessários para o layout do fotógrafo
  return {
    // Dados do usuário ou outras informações necessárias
  };
}

export default function PhotographerLayout() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="photographer-layout">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Área do Fotógrafo</h1>
          <nav className="flex space-x-4">
            <a href="/dashboard/photographer" className="hover:underline">Dashboard</a>
            <a href="/dashboard/photographer/albums" className="hover:underline">Álbuns</a>
            <a href="/dashboard/photographer/profile" className="hover:underline">Perfil</a>
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
