import { Outlet, useLoaderData } from "react-router";
import { Carousel } from "flowbite-react";

export async function loader() {
  // Simulação de dados de eventos
  const events = [
    {
      id: 1,
      image: "/images/event1.jpg",
      title: "Casamento dos Sonhos",
      photographer: "João Silva",
    },
    {
      id: 2,
      image: "/images/event2.jpg",
      title: "Festa de Aniversário",
      photographer: "Maria Oliveira",
    },
    {
      id: 3,
      image: "/images/event3.jpg",
      title: "Evento Corporativo",
      photographer: "Carlos Souza",
    },
  ];

  return { events };
}

export default function DashboardLayout() {
  const { events } = useLoaderData();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}