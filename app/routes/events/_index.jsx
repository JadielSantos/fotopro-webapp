import { useLoaderData, Link } from "react-router";
import { Label, TextInput, Select, Button, Card, Carousel } from "flowbite-react";
import { eventController } from "../../controllers/event.controller";

export async function loader() {
  // Pega 3 eventos de maior relevanceScore
  const eventsRelevantResponse = await eventController.listRelevant(3);
  const eventsListResponse = await eventController.listPaginated(1, 50);

  return {
    eventsRelevant: !eventsRelevantResponse.error ? eventsRelevantResponse.data : [],
    events: !eventsListResponse.error ? eventsListResponse.data.events : [],
  };
}

export default function EventsPage() {
  const { eventsRelevant, events } = useLoaderData();

  return (
    <>
      {/* Banner with Slider */}
      <Carousel className="h-96">
        {eventsRelevant?.map((event) => (
          <div key={event.id} className="relative h-full">
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-full"
            />
            <Link
              key={event.id}
              to={`/events/${event.id}`}
            >
              <div className="absolute bottom-0 left-0 bg-gray-700 bg-opacity-50 text-gray-100 p-4">
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-sm">Fotógrafo: {event.user.name}</p>
              </div>
            </Link>
          </div>
        ))}
      </Carousel>
      <div className="container mx-auto px-4 py-8">
        {/* Filtro */}
        <div className="my-8">
          <h1 className="text-2xl font-bold mb-4">Eventos</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dropdown de tipo de evento */}
            <div>
              <Label htmlFor="eventType" color="dark">Tipo de Evento</Label>
              <Select id="eventType" name="eventType">
                <option value="">Todos</option>
                <option value="wedding">Casamento</option>
                <option value="birthday">Aniversário</option>
                <option value="corporate">Corporativo</option>
              </Select>
            </div>

            {/* Dropdown de localização */}
            <div>
              <Label htmlFor="location" color="dark">Estado</Label>
              <Select id="state" name="state">
                <option value="">Todos</option>
                <option value="SC">Santa Catarina</option>
                <option value="PR">Paraná</option>
                <option value="RS">Rio Grande do Sul</option>
              </Select>
            </div>

            {/* Campo de busca */}
            <div>
              <Label htmlFor="search" color="dark">Buscar Evento</Label>
              <TextInput
                id="search"
                name="search"
                type="text"
                placeholder="Digite o nome do evento"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" className="cursor-pointer">Filtrar</Button>
          </div>
        </div>

        {/* Lista de eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events?.map((event) => (
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
                    <span className="text-sm text-gray-100">{event.date.toLocaleDateString()}</span>
                    <span className="text-sm text-gray-100">
                      {event.city} - {event.state}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-gray-100">{event.title}</h3>
                  <p className="text-sm text-gray-100">
                    Fotógrafo: {event.user.name}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}