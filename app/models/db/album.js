import prisma from "../../db.server";
import { handleDatabaseOperation } from "../../utils/util.ts";

class Album {
  // Create a new album
  static async create(data) {
    try {
      if (!data || typeof data !== "object")
        throw new Error("Invalid data provided for album creation.");

      return await prisma.album.create({ data });
    } catch (error) {
      throw error;
    }
  }

  // Get all albums
  static async getAll() {
    try {
      return await prisma.album.findMany();
    } catch (error) {
      throw error;
    }
  }

  // Get a single album by ID
  static async getById(id) {
    try {
      if (!id) throw new Error("Invalid ID provided for album retrieval.");

      return await prisma.album.findUnique({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  // Update an album by ID
  static async update(id, data) {
    try {
      if (!data || typeof data !== "object" || !id)
        throw new Error("Invalid data provided for album update.");

      return await prisma.album.update({ where: { id }, data });
    } catch (error) {
      throw error;
    }
  }

  // Delete an album by ID
  static async delete(id) {
    try {
      if (!id) throw new Error("Invalid ID provided for album deletion.");

      return await prisma.album.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}

export const album = new Album();
