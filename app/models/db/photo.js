import prisma from "../../db.server";
import { handleDatabaseOperation } from "../../utils/util.ts";

export default class PhotoService {
  // Create a new photo
  static async create(data) {
    if (!data || typeof data !== "object")
      throw new Error("Invalid data provided for photo creation.");

    return handleDatabaseOperation(() => prisma.photo.create({ data }));
  }

  // Get all photos
  static async getAll() {
    return handleDatabaseOperation(() => prisma.photo.findMany());
  }

  // Get a single photo by ID
  static async getById(id) {
    if (!id) throw new Error("Invalid ID provided for photo retrieval.");

    return handleDatabaseOperation(() =>
      prisma.photo.findUnique({
        where: { id },
      })
    );
  }

  // Update a photo by ID
  static async update(id, data) {
    if (!data || typeof data !== "object" || !id)
      throw new Error("Invalid data provided for photo update.");

    return handleDatabaseOperation(() =>
      prisma.photo.update({
        where: { id },
        data,
      })
    );
  }

  // Delete a photo by ID
  static async delete(id) {
    if (!id) throw new Error("Invalid ID provided for photo deletion.");

    return handleDatabaseOperation(() =>
      prisma.photo.delete({
        where: { id },
      })
    );
  }
}
