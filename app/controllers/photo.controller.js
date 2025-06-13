import { photoModel } from "../models/photo.model.js";
import { googleService } from "../services/google.service.js";
import { handlelize, writeFileToTemp } from "../utils/util.js";

class PhotoController {
  /**
   * Creates a new photo.
   * @param {Object} data Photo data.
   * @returns {Promise<Object>} Created photo or error.
   */
  async create(data) {
    try {
      const photo = await photoModel.create(data);
      return { status: 201, data: photo };
    } catch (error) {
      console.error("Error creating photo:", error);
      return { status: 500, message: "Failed to create photo.", error: true };
    }
  }

  /**
   * Retrieves all photos from event.
   * @param {string} eventId Event ID.
   * @returns {Promise<Object>} List of photos or error.
   */
  async getAll(eventId) {
    try {
      if (!eventId) {
        return { status: 400, message: "Event ID is required.", error: true };
      }

      const photos = await photoModel.getByQuery({ where: { eventId } });
      return { status: 200, data: photos };
    } catch (error) {
      console.error("Error retrieving photos:", error);
      return {
        status: 500,
        message: "Failed to retrieve photos.",
        error: true,
      };
    }
  }

  /**
   * Retrieves photos by query.
   * @param {Object} query Query parameters.
   * @returns {Promise<Object>} List of photos or error.
   */
  async getByQuery(query) {
    try {
      if (!query || typeof query !== "object") {
        return { status: 400, message: "Invalid query parameters.", error: true };
      }

      const photos = await photoModel.getByQuery(query);
      return { status: 200, data: photos };
    } catch (error) {
      console.error("Error retrieving photos by query:", error);
      return { status: 500, message: "Failed to retrieve photos by query.", error: true };
    }
  }

  /**
   * Upload photos (upload to Google Drive and create a photo)
   * @param {Object} files Files to upload.
   * @param {string} eventId Event ID.
   * @returns {Promise<Object>} Created photos or error.
   */
  async uploadPhotos(files, eventId) {
    try {
      if (!files || !eventId)
        return {
          status: 400,
          message: "Files and event ID are required.",
          error: true,
        };

      const batchSize = 5;
      const photos = [];
      const authClient = await googleService.authorize();

      var uploadedPhotos = 0;

      if (!authClient)
        return {
          status: 500,
          message: "Failed to authorize Google Drive client.",
          error: true,
        };

      const photoCount = await photoModel.countByEvent(eventId);

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const uploadPromises = batch.map(async (file) => {
          uploadedPhotos++;
          
          const fileName = `${eventId}-${Date.now()}-${handlelize(file.name)}`;
          const uploadedFile = await googleService.uploadFile(
            authClient,
            file,
            fileName,
          );

          photos.push({
            eventId,
            url: uploadedFile.url,
            fileName,
            fileId: uploadedFile.fileId,
            altText: uploadedFile.fileName,
            isCover: photos.length === 0 && photoCount === 0,
          });
        });
        await Promise.all(uploadPromises);
      }

      await photoModel.createMany(photos);

      return { status: 201, data: photos };
    } catch (error) {
      console.error("Error uploading photos:", error);
      return { status: 500, message: "Failed to upload photos.", error: true };
    }
  }

  /**
   * Prepara os arquivos de selfie e photos do event.
   * @param {string} eventId ID do evento.
   * @param
   */
  async handleSelfieSubmit(eventId, selfieFile) {
    try {
      if (!selfieFile || !selfieFile?.name)
        return {
          status: 400,
          message: "Invalid file. Please upload a valid selfie.",
          error: true,
        };

      const tempEventDir = "fotopro/" + eventId + `_${Date.now()}`;
      const selfiePath = await writeFileToTemp(
        selfieFile,
        tempEventDir + "/selfie"
      );

      const authClient = await googleService.authorize();

      const driveFiles = await googleService.downloadFiles(
        authClient,
        eventId,
        tempEventDir + "/photos"
      );

      if (!driveFiles || driveFiles.length === 0) {
        return {
          status: 404,
          message: "No photos found for the event.",
          error: true,
        };
      }

      return {
        status: 200,
        data: {
          selfiePath,
          tempEventDir,
          driveFiles,
          message: "Selfie processed successfully.",
        },
      };
    } catch (error) {
      return {
        status: 500,
        message: "Erro ao processar a selfie.",
        error: true,
      };
    }
  }

  /**
   * Deleta uma foto pelo ID.
   * @param {string} id ID da foto.
   * @return {Promise<Object>} Resultado da deleção ou erro.
   */
  async deleteById(id) {
    try {
      if (!id) {
        return { status: 400, message: "Photo ID is required.", error: true };
      }

      const photo = await photoModel.getById(id);
      if (!photo) {
        return { status: 404, message: "Photo not found.", error: true };
      }

      if (photo.isCover) {
        let photoAux = await photoModel.getByQuery({
          where: { eventId: photo.eventId, isCover: false },
          take: 1,
        });
        const photoCount = await photoModel.countByEvent(photo.eventId);

        if (photoAux?.length) {
          await photoModel.update(photoAux[0].id, { isCover: true });
        } else if (photoCount <= 1) {
          return {
            status: 400,
            message: "Não é possível excluir a foto de capa, pois é a única foto do evento.",
            error: true,
          };
        }
      }

      await photoModel.delete(id);

      const authClient = await googleService.authorize();

      if (photo.fileId) {
        await googleService.deleteFile(
          authClient,
          photo.fileId
        );
      }

      return { status: 200, message: "Photo deleted successfully." };
    } catch (error) {
      console.error("Error deleting photo:", error);
      return { status: 500, message: "Failed to delete photo.", error: true };
    }
  }
}

export const photoController = new PhotoController();
