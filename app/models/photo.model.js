import prisma from "../db.server";

class Photo {
  // Create a new photo
  static async create(data) {
    try {
      if (!data || typeof data !== "object")
        throw new Error("Invalid data provided for photo creation.");

      return await prisma.photo.create({ data });
    } catch (error) {
      throw new Error("Failed to create photo.");
    }
  }

  // Get all photos
  static async getAll() {
    try {
      return await prisma.photo.findMany();
    } catch (error) {
      throw new Error("Failed to retrieve photos.");
    }
  }

  // Get a single photo by ID
  static async getById(id) {
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
  static async update(id, data) {
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
  static async delete(id) {
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

export const photo = new Photo();
