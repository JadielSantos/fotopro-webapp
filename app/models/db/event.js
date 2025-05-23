import prisma from "../../db.server";
import { handleDatabaseOperation } from "../../utils/util.ts";

class Event {
  // Create a new event
  static async create(data) {
    if (!data || typeof data !== "object")
      throw new Error("Invalid data provided for event creation.");

    return handleDatabaseOperation(() => prisma.event.create({ data }));
  }

  // Get all events
  static async getAll() {
    return handleDatabaseOperation(() => prisma.event.findMany());
  }

  // Get a single event by ID
  static async getById(id) {
    if (!id) throw new Error("Invalid ID provided for event retrieval.");

    return handleDatabaseOperation(() =>
      prisma.event.findUnique({
        where: { id },
      })
    );
  }

  // Update an event by ID
  static async update(id, data) {
    if (!data || typeof data !== "object" || !id)
      throw new Error("Invalid data provided for event update.");

    return handleDatabaseOperation(() =>
      prisma.event.update({
        where: { id },
        data,
      })
    );
  }

  // Delete an event by ID
  static async delete(id) {
    if (!id) throw new Error("Invalid ID provided for event deletion.");

    return handleDatabaseOperation(() =>
      prisma.event.delete({
        where: { id },
      })
    );
  }
}

export const event = new Event();