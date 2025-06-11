import { useLoaderData } from "react-router";
import { Card, Button } from "flowbite-react";
import { eventController } from "../../../../controllers/event.controller";

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
  const coverPhoto = event.photos?.find(photo => photo.isCover) || null;

  const page = params.page ? parseInt(params.page, 10) : 1;
  const totalPages = event.photos?.length ? Math.ceil(event.photos.length / photosPerPage) : 0;
  const paginatedPhotos = event.photos?.length ? event.photos.slice((page - 1) * photosPerPage, page * photosPerPage) : [];

  return { event, photos: paginatedPhotos, page, totalPages, coverPhoto };
}

export default function PhotosPage() {
  const { event, photos, page, totalPages, coverPhoto } = useLoaderData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título do evento */}
      <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

      {/* Banner */}
      <div className="mb-8">
        <img
          src={coverPhoto}
          alt={`Banner for ${event.title}`}
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Lista de fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {photos.map((photo) => (
          <Card key={photo.id} className="rounded-lg shadow-md">
            <img
              src={photo.url}
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