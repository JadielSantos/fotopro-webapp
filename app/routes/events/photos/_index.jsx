import { useLoaderData } from "react-router";
import { Card, Button } from "flowbite-react";

export async function loader({ params, request }) {
  const { eventId } = params;

  // Simulação de dados do evento e fotos (substituir por lógica real no backend)
  const event = {
    id: eventId,
    title: "Casamento dos Sonhos",
    bannerImage: "/images/banner.jpg",
  };

  const photos = Array.from({ length: 300 }, (_, index) => ({
    id: index + 1,
    url: `/images/photo${index + 1}.jpg`,
    display: true,
  })).filter((photo) => photo.display);

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const photosPerPage = 102;
  const totalPages = Math.ceil(photos.length / photosPerPage);
  const paginatedPhotos = photos.slice((page - 1) * photosPerPage, page * photosPerPage);

  return { event, photos: paginatedPhotos, page, totalPages };
}

export default function PhotosPage() {
  const { event, photos, page, totalPages } = useLoaderData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título do evento */}
      <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

      {/* Banner */}
      <div className="mb-8">
        <img
          src={event.bannerImage}
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
            <Button href={`?page=${page - 1}`} color="light">
              Página Anterior
            </Button>
          )}
          {page < totalPages && (
            <Button href={`?page=${page + 1}`} color="light">
              Próxima Página
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}