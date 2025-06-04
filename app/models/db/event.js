import prisma from "../../db.server";

class Event {
  // Create a new event
  static async create(data) {
    try {
      if (!data || typeof data !== "object")
        throw new Error("Invalid data provided for event creation.");

      return await prisma.event.create({ data });
    } catch (error) {
      throw new Error("Failed to create event.");
    }
  }

  // Get all events
  static async getAll() {
    try {
      return await prisma.event.findMany();
    } catch (error) {
      throw new Error("Failed to retrieve events.");
    }
  }

  // Get a single event by ID
  static async getById(id) {
    try {
      if (!id) throw new Error("Invalid ID provided for event retrieval.");

      return await prisma.event.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to retrieve event by ID.");
    }
  }

  // Update an event by ID
  static async update(id, data) {
    try {
      if (!data || typeof data !== "object" || !id)
        throw new Error("Invalid data provided for event update.");

      return await prisma.event.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Failed to update event.");
    }
  }

  // Delete an event by ID
  static async delete(id) {
    try {
      if (!id) throw new Error("Invalid ID provided for event deletion.");

      return await prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to delete event.");
    }
  }
}

export const event = new Event();
