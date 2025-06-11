import { Link } from "react-router";
import { Button, Card } from "flowbite-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          Oops! A página que você está procurando não foi encontrada.
        </p>
        <p className="mt-2 text-gray-500">
          Talvez você tenha digitado o endereço errado ou a página foi movida.
        </p>
        <Link to="/events" className="mt-6 inline-block">
          <Button color="primary" className="w-full cursor-pointer">
            Voltar para a página inicial
          </Button>
        </Link>
      </Card>
    </div>
  );
}