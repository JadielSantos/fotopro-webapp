import { photoModel } from "../models/photo.model.js";
import { googleService } from "../services/google.service.js";

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
      return { status: 500, message: "Failed to retrieve photos.", error: true };
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
      if (!files || !eventId) return { status: 400, message: "Files and event ID are required.", error: true };

      const batchSize = 5;
      const photos = [];
      const authClient = await googleService.authorize();

      var uploadedPhotos = 0;

      if (!authClient) return { status: 500, message: "Failed to authorize Google Drive client.", error: true };

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        const uploadPromises = batch.map(async (file) => {
          uploadedPhotos++;
          
          const uploadedFile = await googleService.uploadFile(authClient, file, `${eventId}-${Date.now()}-${file.name}`);

          photos.push({
            eventId,
            url: uploadedFile.url,
            altText: uploadedFile.fileName,
            isCover: photos.length === 0, // Set the first photo as cover
          });
        });
        await Promise.all(uploadPromises);
        console.log(`Uploaded batch ${Math.ceil((i + batchSize) / batchSize)} of ${Math.ceil(files.length / batchSize)}`);
      }

      await photoModel.createMany(photos);

      return { status: 201, data: photos };
    } catch (error) {
      console.error("Error uploading photos:", error);
      return { status: 500, message: "Failed to upload photos.", error: true };
    }
  }
}

export const photoController = new PhotoController();