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
      {/* Banner with Slider */}
      <header className="bg-white shadow">
        <Carousel className="h-64">
          {events.map((event) => (
            <div key={event.id} className="relative h-full">
              <img
                src={event.image}
                alt={event.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-sm">Fotógrafo: {event.photographer}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}