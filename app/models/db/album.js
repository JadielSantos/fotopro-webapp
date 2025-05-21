import prisma from "../../db.server";
import { handleDatabaseOperation } from "../../utils/util.ts";

export default class AlbumService {
  // Create a new album
  static async create(data) {
    if (!data || typeof data !== "object")
      throw new Error("Invalid data provided for album creation.");

    return handleDatabaseOperation(() => prisma.album.create({ data }));
  }

  // Get all albums
  static async getAll() {
    return handleDatabaseOperation(() => prisma.album.findMany());
  }

  // Get a single album by ID
  static async getById(id) {
    if (!id) throw new Error("Invalid ID provided for album retrieval.");

    return handleDatabaseOperation(() =>
      prisma.album.findUnique({
        where: { id },
      })
    );
  }

  // Update an album by ID
  static async update(id, data) {
    if (!data || typeof data !== "object" || !id)
      throw new Error("Invalid data provided for album update.");

    return handleDatabaseOperation(() =>
      prisma.album.update({
        where: { id },
        data,
      })
    );
  }

  // Delete an album by ID
  static async delete(id) {
    if (!id) throw new Error("Invalid ID provided for album deletion.");

    return handleDatabaseOperation(() =>
      prisma.album.delete({
        where: { id },
      })
    );
  }
}
