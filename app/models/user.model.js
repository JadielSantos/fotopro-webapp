import prisma from "../db.server";

class User {
  // Create a new user
  async create(data) {
    try {
      if (!data || typeof data !== "object")
        throw new Error("Invalid data provided for user creation.");

      return await prisma.user.create({ data });
    } catch (error) {
      throw new Error("Failed to create user.");
    }
  }

  // Get all users
  async getAll() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      throw new Error("Failed to retrieve users.");
    }
  }

  /* Get a single user by ID
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<Object>} - A promise that resolves to the user object.
   */
  async getById(id, { includePhotosSelections = false, includeEvents = false } = {}) {
    try {
      if (!id) throw new Error("Invalid ID provided for user retrieval.");

      return await prisma.user.findUnique({
        where: { id },
        include: {
          photosSelections: includePhotosSelections,
          events: includeEvents,
        }
      });
    } catch (error) {
      throw new Error("Failed to retrieve user by ID.");
    }
  }

  /* Get users by query
   * @param {Object} query - The query object to filter users.
   * @returns {Promise<Array>} - A promise that resolves to an array of users matching the query.
   */
  async getByQuery(query) {
    try {
      if (!query || typeof query !== "object")
        throw new Error("Invalid query provided for user retrieval.");

      return await prisma.user.findMany({
        where: query,
      });
    } catch (error) {
      throw new Error("Failed to retrieve users by query.");
    }
  }

  // Update a user by ID
  async update(id, data) {
    try {
      if (!data || typeof data !== "object" || !id)
        throw new Error("Invalid data provided for user update.");

      return await prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Failed to update user.");
    }
  }

  // Delete a user by ID
  async delete(id) {
    try {
      if (!id) throw new Error("Invalid ID provided for user deletion.");

      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Failed to delete user.");
    }
  }
}

export const userModel = new User();
