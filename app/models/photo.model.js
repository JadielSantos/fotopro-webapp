import prisma from "../db.server";

class Photo {
  // Create a new photo
  async create(data) {
    try {
      if (!data || typeof data !== "object")
        throw new Error("Invalid data provided for photo creation.");

      return await prisma.photo.create({ data });
    } catch (error) {
      throw new Error("Failed to create photo.");
    }
  }

  // Create multiple photos
  async createMany(data) {
    try {
      if (!data || !Array.isArray(data))
        throw new Error("Invalid data provided for photo creation.");

      return await prisma.photo.createMany({ data });
    } catch (error) {
      throw new Error("Failed to create multiple photos.");
    }
  }

  // Get all photos
  async getAll() {
    try {
      return await prisma.photo.findMany();
    } catch (error) {
      throw new Error("Failed to retrieve photos.");
    }
  }

  // Get photos by query
  async getByQuery(query) {
    try {
      if (!query || typeof query !== "object")
        throw new Error("Invalid query provided for photo retrieval.");

      return await prisma.photo.findMany(query);
    } catch (error) {
      throw new Error("Failed to retrieve photos by query.");
    }
  }

  // Get a single photo by ID
  async getById(id) {
    try {
      if (!id) throw new Error("Invalid ID provided for photo retrieval.");

      return await prisma.photo.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to retrieve photo by ID.");
    }
  }

  // Update a photo by ID
  async update(id, data) {
    try {
      if (!data || typeof data !== "object" || !id)
        throw new Error("Invalid data provided for photo update.");

      return await prisma.photo.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Failed to update photo.");
    }
  }

  // Delete a photo by ID
  async delete(id) {
    try {
      if (!id) throw new Error("Invalid ID provided for photo deletion.");

      return await prisma.photo.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to delete photo.");
    }
  }
}

export const photoModel = new Photo();
