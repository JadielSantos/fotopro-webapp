import { useLoaderData, Link, redirect } from "react-router";
import { Card, Button } from "flowbite-react";
import {
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import { eventController } from "../../../controllers/event.controller";
import { userController } from "../../../controllers/user.controller";
import { getAuthToken } from "../../../utils/auth.server";
import PhotosSelectionList from "../../../components/PhotosSelectionList";
import { photoController } from "../../../controllers/photo.controller";

export async function loader({ request, params }) {
  const { eventId } = params;
  const token = await getAuthToken(request);
  var user = null;

  if (token) {
    const validationResponse = await userController.validateToken(token);

    if (!validationResponse.error) {

      const loginData = validationResponse.data;

      // Fetch additional user details if needed
      const userResponse = await userController.getById(loginData.id);

      if (!userResponse.error) {
        user = userResponse.data;
      }
    }
  }

  const eventResponse = await eventController.findById(eventId, {
    includeUser: true,
    includePhotos: true,
    includePhotosSelections: true,
  });
  if (eventResponse?.error && eventResponse.status === 404) {
    console.error("Event not found for ID:", eventId);
    return redirect("/not-found");
  } else if (eventResponse?.error) {
    console.error("Error fetching event details:", eventResponse.message);
    return redirect("/events");
  }

  return { event: eventResponse.data, user, isOwner: user?.id === eventResponse.data.userId || user?.role === "ADMIN" };
}

export async function action({ request }) {
  const formData = {
    ...Object.fromEntries(await request.formData())
  };

  if (formData.photosList) {
    const photosResponse = await photoController.getByQuery({
      where: {
        id: {
          in: formData.photosList.split(","),
        },
      },
    });

    if (photosResponse.error) {
      return { error: photosResponse.message, status: 500 };
    }

    return {
      photos: photosResponse.data,
    }
  }

  return { error: "Invalid action", status: 400 };
}

export default function EventPage() {
  const { event, user, isOwner } = useLoaderData();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        {/* Título do evento */}
        <h1 className="text-3xl font-bold mb-4 text-secondary-200">{event.title}</h1>

        {/* Editar evento link */}
        {user?.id === event.userId || user?.role === "ADMIN" ? (
          <Link to={`/events/${event.id}/edit`}>
            <Button color="gray" className="mb-4 cursor-pointer">
              Editar Evento
            </Button>
          </Link>) : null
        }

        {/* Localização e data */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <FiMapPin className="text-secondary-200" />
            <span className="text-secondary-200">
              {event.city} - {event.state}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-secondary-200" />
            <span className="text-secondary-200">{event.date.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Nome do fotógrafo */}
        <p className="text-lg text-secondary-200 mb-4">
          Fotógrafo: <span className="font-semibold">{event.user.name}</span>
        </p>

        {/* Total de fotos */}
        <p className="text-lg text-secondary-200 mb-4">
          Total de fotos: <span className="font-semibold">{event.photos?.length}</span>
        </p>

        {/* Cover photo */}
        {event.photos?.find(photo => photo.isCover) &&
          <div className="mb-6">
            <img
              src={event.photos?.find(photo => photo.isCover)?.url + "&sz=w800"}
              alt={`Cover photo of ${event.title}`}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        }

        {/* Botões */}
        <div className="flex space-x-4">
          <Link to={`/events/${event.id}/photos/face-filtered`}>
            <Button color="light" className="w-full cursor-pointer">
              Filtrar por Face
            </Button>
          </Link>
          <Link to={`/events/${event.id}/photos`}>
            <Button color="blue" className="w-full cursor-pointer">
              Ver Todas as Fotos
            </Button>
          </Link>
        </div>
      </Card>

      {/* Lista de seleções de fotos */}
      {isOwner &&
        <PhotosSelectionList title={"Seleções de Fotos"} photosSelections={event.photosSelections} />
      }
    </div>
  );
}