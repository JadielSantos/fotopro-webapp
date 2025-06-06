import { useLoaderData, Link } from "react-router";
import { Label, TextInput, Select, Button, Card, Carousel } from "flowbite-react";

export async function loader() {
  // Simulação de dados de eventos
  const events = [
    {
      id: 1,
      image: "/images/event1.jpg",
      date: "2025-06-04",
      location: { city: "Blumenau", state: "SC" },
      title: "Casamento dos Sonhos",
      photographer: "João Silva",
    },
    {
      id: 2,
      image: "/images/event2.jpg",
      date: "2025-06-10",
      location: { city: "Curitiba", state: "PR" },
      title: "Festa de Aniversário",
      photographer: "Maria Oliveira",
    },
    {
      id: 3,
      image: "/images/event3.jpg",
      date: "2025-06-15",
      location: { city: "Porto Alegre", state: "RS" },
      title: "Evento Corporativo",
      photographer: "Carlos Souza",
    },
  ];

  return { events };
}

export default function EventsPage() {
  const { events } = useLoaderData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner with Slider */}
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

      {/* Filtro */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Eventos</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dropdown de tipo de evento */}
          <div>
            <Label htmlFor="eventType" value="Tipo de Evento" />
            <Select id="eventType" name="eventType">
              <option value="">Todos</option>
              <option value="wedding">Casamento</option>
              <option value="birthday">Aniversário</option>
              <option value="corporate">Corporativo</option>
            </Select>
          </div>

          {/* Dropdown de localização */}
          <div>
            <Label htmlFor="location" value="Estado" />
            <Select id="location" name="location">
              <option value="">Todos</option>
              <option value="SC">Santa Catarina</option>
              <option value="PR">Paraná</option>
              <option value="RS">Rio Grande do Sul</option>
            </Select>
          </div>

          {/* Campo de busca */}
          <div>
            <Label htmlFor="search" value="Buscar por Nome" />
            <TextInput
              id="search"
              name="search"
              type="text"
              placeholder="Digite o nome do evento"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button type="submit">Filtrar</Button>
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <Card className="rounded-lg shadow-md">
              {/* Imagem do evento */}
              <div className="h-60 overflow-hidden rounded-t-lg">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Informações do evento */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">{event.date}</span>
                  <span className="text-sm text-gray-500">
                    {event.location.city} - {event.location.state}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600">
                  Fotógrafo: {event.photographer}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}