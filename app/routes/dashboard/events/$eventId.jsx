import { useLoaderData, Link } from "react-router";
import { Card, Button } from "flowbite-react";
import {
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";

export async function loader({ params }) {
  const { eventId } = params;

  // Simulação de dados do evento (substituir por lógica real no backend)
  const event = {
    id: eventId,
    title: "Casamento dos Sonhos",
    location: { city: "Blumenau", state: "SC" },
    date: "2025-06-04",
    photographer: "João Silva",
    totalPhotos: 120,
    coverPhoto: "/images/event1.jpg",
  };

  return { event };
}

export default function EventPage() {
  const { event } = useLoaderData();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        {/* Título do evento */}
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

        {/* Localização e data */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <FiMapPin className="text-gray-600" />
            <span className="text-gray-700">
              {event.location.city} - {event.location.state}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-gray-600" />
            <span className="text-gray-700">{event.date}</span>
          </div>
        </div>

        {/* Nome do fotógrafo */}
        <p className="text-lg text-gray-600 mb-4">
          Fotógrafo: <span className="font-semibold">{event.photographer}</span>
        </p>

        {/* Total de fotos */}
        <p className="text-lg text-gray-600 mb-4">
          Total de fotos: <span className="font-semibold">{event.totalPhotos}</span>
        </p>

        {/* Cover photo */}
        <div className="mb-6">
          <img
            src={event.coverPhoto}
            alt={`Cover photo of ${event.title}`}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Botões */}
        <div className="flex space-x-4">
          <Link to={`/events/${event.id}/photos/face-filtered`}>
            <Button color="light" className="w-full">
              Filtrar por Face
            </Button>
          </Link>
          <Link to={`/events/${event.id}/photos`}>
            <Button color="blue" className="w-full">
              Ver Todas as Fotos
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}