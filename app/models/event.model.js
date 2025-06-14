import prisma from "../db.server";

class Event {
  // Create a new event
  async create(data) {
    try {
      if (!data || typeof data !== "object")
        throw new Error("Invalid data provided for event creation.");
    
      return await prisma.event.create({ data });
    } catch (error) {
      throw new Error(error);
    }
  }

  // Get all events
  async getAll() {
    try {
      return await prisma.event.findMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  // Get a single event by ID
  async getById(id, { includeUser = false , includePhotos = false, includePhotosSelections = false } = {}) {
    try {
      if (!id) throw new Error("Invalid ID provided for event retrieval.");

      return await prisma.event.findUnique({
        where: { id },
        include: {
          user: includeUser,
          photos: includePhotos,
          photosSelections: includePhotosSelections
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByQuery(query) {
    try {
      if (!query || typeof query !== "object")
        throw new Error("Invalid query provided for event retrieval.");

      return await prisma.event.findMany(query);
    } catch (error) {
      throw new Error(error);
    }
  }

  async count() {
    try {
      return await prisma.event.count();
    } catch (error) {
      throw new Error(error);
    }
  }

  // Update an event by ID
  async update(id, data) {
    try {
      if (!data || typeof data !== "object" || !id)
        throw new Error(error);

      return await prisma.event.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // Delete an event by ID
  async delete(id) {
    try {
      if (!id) throw new Error("Invalid ID provided for event deletion.");

      return await prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const eventModel = new Event();
