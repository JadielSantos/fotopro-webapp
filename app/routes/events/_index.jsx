import { useLoaderData, Link } from "react-router";
import { Button, Card, Carousel } from "flowbite-react";
import { eventController } from "../../controllers/event.controller";
import { getAuthToken } from "../../utils/auth.server";
import { userController } from "../../controllers/user.controller";

const eventsPerPage = 20;

export async function loader({ request }) {
  const url = new URL(request.url);
  const currentPage = url.searchParams.get("page") ? parseInt(url.searchParams.get("page"), 10) : 1;
  const token = await getAuthToken(request);
  var validationResponse = null;

  if (token) {
    validationResponse = await userController.validateToken(token);
  }

  // Pega 3 eventos de maior relevanceScore
  const eventsRelevantResponse = await eventController.listRelevant(3);
  const eventsListResponse = await eventController.listPaginated(currentPage, eventsPerPage, validationResponse?.data);

  if (eventsListResponse.error) {
    return { error: eventsListResponse.message };
  }

  return {
    eventsRelevant: !eventsRelevantResponse.error ? eventsRelevantResponse.data : [],
    events: !eventsListResponse.error ? eventsListResponse.data.events : [],
    page: currentPage,
    totalPages: eventsListResponse.data.totalPages,
  };
}

export default function EventsPage() {
  const { eventsRelevant, events, page, totalPages } = useLoaderData();

  return (
    <>
      {/* Banner with Slider */}
      <Carousel className="h-96">
        {eventsRelevant?.map((event) => (
          <div key={event.id} className="relative h-full">
            {event.photos?.find(photo => photo.isCover) &&
              <img
                src={event.photos?.find(photo => photo.isCover)?.url?.includes("drive") ? event.photos?.find(photo => photo.isCover)?.url + "&sz=w800" : event.photos?.find(photo => photo.isCover)?.url}
                alt={event.title}
                className="object-cover w-full h-full"
              />
            }
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
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
            
            {/* Dropdown de tipo de evento */}
            {/* <div>
              <Label htmlFor="eventType" color="dark">Tipo de Evento</Label>
              <Select id="eventType" name="eventType">
                <option value="">Todos</option>
                <option value="wedding">Casamento</option>
                <option value="birthday">Aniversário</option>
                <option value="corporate">Corporativo</option>
              </Select>
            </div> */}

            {/* Dropdown de localização */}
            {/* <div>
              <Label htmlFor="location" color="dark">Estado</Label>
              <Select id="state" name="state">
                <option value="">Todos</option>
                <option value="SC">Santa Catarina</option>
                <option value="PR">Paraná</option>
                <option value="RS">Rio Grande do Sul</option>
              </Select>
            </div> */}

            {/* Campo de busca */}
            {/* <div>
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
          </div> */}
        </div> 

        {/* Lista de eventos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events?.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <Card className="rounded-lg shadow-md h-full">
                {/* Imagem do evento */}
                {event.photos?.find(photo => photo.isCover) &&
                  <div className="h-60 overflow-hidden rounded-t-lg">
                    <img
                      src={event.photos?.find(photo => photo.isCover)?.url?.includes("drive") ? event.photos?.find(photo => photo.isCover)?.url + "&sz=w600" : event.photos?.find(photo => photo.isCover)?.url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                }

                {/* Informações do evento */}
                <div className={`p-4 ${!event.photos?.find(photo => photo.isCover) && "h-full"}`} >
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

        {/* Paginação */}
        <div className="flex justify-between items-center mt-4 md:mt-6">
          <span className="text-gray-600">
            Página {page} de {totalPages}
          </span>
          <div className="flex space-x-4">
            {page > 1 && (
              <Button href={`?page=${page - 1}`} color="light" className="cursor-pointer">
                Página Anterior
              </Button>
            )}
            {page < totalPages && (
              <Button href={`?page=${page + 1}`} color="light" >
                Próxima Página
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}