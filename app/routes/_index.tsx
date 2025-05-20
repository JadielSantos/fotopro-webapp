import { Link, useLoaderData, type LoaderFunctionArgs, } from 'react-router';
import { Button } from '~/components/ui';
import { UserRole } from '~/models/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  return {};
}

export default function HomePage() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Plataforma de Fotografia de Eventos
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Compartilhe, visualize e compre fotos de eventos com reconhecimento facial automático.
              Encontre todas as suas fotos agrupadas por pessoa.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/login/photographer">
                <Button variant="outline" size="lg">
                  Sou Fotógrafo
                </Button>
              </Link>
              <Link to="/login/client">
                <Button variant="primary" size="lg">
                  Sou Cliente
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-12">Como funciona</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Para Fotógrafos</h3>
              <p className="text-gray-600">
                Faça upload de suas fotos, organize em álbuns e compartilhe com seus clientes de forma segura.
              </p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Reconhecimento Facial</h3>
              <p className="text-gray-600">
                Nossa tecnologia agrupa automaticamente as fotos por pessoa, facilitando a busca e seleção.
              </p>
            </div>
            
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Para Clientes</h3>
              <p className="text-gray-600">
                Acesse, visualize e compre suas fotos favoritas com facilidade, sem precisar procurar entre centenas de imagens.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-6">Comece agora mesmo</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Cadastre-se gratuitamente e experimente uma nova forma de compartilhar e acessar fotos de eventos.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register/photographer">
              <Button variant="outline" size="lg">
                Cadastrar como Fotógrafo
              </Button>
            </Link>
            <Link to="/register/client">
              <Button variant="primary" size="lg">
                Cadastrar como Cliente
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Plataforma de Fotografia</h3>
              <p className="text-gray-400">
                Compartilhe, visualize e compre fotos de eventos com reconhecimento facial automático.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white">Início</a></li>
                <li><a href="/login/photographer" className="hover:text-white">Login de Fotógrafo</a></li>
                <li><a href="/login/client" className="hover:text-white">Login de Cliente</a></li>
                <li><a href="/register/photographer" className="hover:text-white">Cadastro de Fotógrafo</a></li>
                <li><a href="/register/client" className="hover:text-white">Cadastro de Cliente</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <p className="text-gray-400">
                Tem alguma dúvida? Entre em contato conosco.
              </p>
              <p className="text-gray-400 mt-2">
                contato@plataformafotografia.com.br
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Plataforma de Fotografia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
