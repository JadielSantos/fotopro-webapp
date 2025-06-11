import { useLoaderData } from "react-router";
import { Button, Card } from "flowbite-react";

export async function loader({ request }) {
  return {
    message: "Acesso negado. Você não tem permissão para acessar esta página.",
  };
}

export default function AccessDeniedPage() {
  const data = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="text-center">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500"
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
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Acesso Negado</h2>
          <p className="mt-2 text-sm text-gray-600">{data.message}</p>
        </Card>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <p className="mb-4 text-center">Você pode tentar:</p>
          <div className="space-y-2">
            <Button href="/events" color="blue" className="w-full cursor-pointer">
              Voltar para a página inicial
            </Button>
            <Button href="/auth/login" color="light" className="w-full cursor-pointer">
              Fazer login novamente
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}