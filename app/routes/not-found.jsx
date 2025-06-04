import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          Oops! A página que você está procurando não foi encontrada.
        </p>
        <p className="mt-2 text-gray-500">
          Talvez você tenha digitado o endereço errado ou a página foi movida.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block"
        >
          <button
            type="button"
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Voltar para a página inicial
          </button>
        </Link>
      </div>
    </div>
  );
}