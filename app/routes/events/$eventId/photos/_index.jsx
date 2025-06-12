import { useLoaderData } from "react-router";
import { Card, Button } from "flowbite-react";
import { eventController } from "../../../../controllers/event.controller";
import { FiArrowLeft } from "react-icons/fi";

export async function loader({ params, request }) {
  const { eventId } = params;
  const photosPerPage = 102;

  const eventResponse = await eventController.findById(eventId);
  if (eventResponse?.error && eventResponse.status === 404) {
    console.error("Event not found for ID:", eventId);
    return redirect("/not-found");
  } else if (eventResponse?.error) {
    console.error("Error fetching event details:", eventResponse.message);
    return redirect("/events");
  }
  const event = eventResponse.data;

  const page = params.page ? parseInt(params.page, 10) : 1;
  const totalPages = event.photos?.length ? Math.ceil(event.photos.length / photosPerPage) : 0;
  const paginatedPhotos = event.photos?.length ? event.photos.slice((page - 1) * photosPerPage, page * photosPerPage) : [];

  return { event, photos: paginatedPhotos, page, totalPages };
}

export default function PhotosPage() {
  const { event, photos, page, totalPages } = useLoaderData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        {/* Título do evento */}
        <h1 className="text-3xl font-bold">{event.title}</h1>

        {/* Voltar para o evento */}
        <Button href={`/events/${event.id}`} color="transparent">
          <FiArrowLeft className="mr-2" />
          Voltar
        </Button>
      </div>

      {/* Lista de fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {photos.map((photo) => (
          <Card key={photo.id} className="rounded-lg shadow-md">
            <img
              src={photo.url + "&sz=w600"}
              alt={`Photo ${photo.id}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center">
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
  );
}