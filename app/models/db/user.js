import prisma from "../../db.server";
import { handleDatabaseOperation } from "../../utils/util.ts";

class User {
  // Create a new user
  async create(data) {
    if (!data || typeof data !== "object")
      throw new Error("Invalid data provided for user creation.");

    return handleDatabaseOperation(() => prisma.user.create({ data }));
  }

  // Get all users
  async getAll() {
    return handleDatabaseOperation(() => prisma.user.findMany());
  }

  /* Get a single user by ID
    * @param {string} id - The ID of the user to retrieve.
    * @returns {Promise<Object>} - A promise that resolves to the user object.
    */
  async getById(id) {
    if (!id) throw new Error("Invalid ID provided for user retrieval.");

    return handleDatabaseOperation(() =>
      prisma.user.findUnique({
        where: { id },
      })
    );
  }

  /* Get users by query
    * @param {Object} query - The query object to filter users.
    * @returns {Promise<Array>} - A promise that resolves to an array of users matching the query.
    */
  async getByQuery(query) {
    if (!query || typeof query !== "object")
      throw new Error("Invalid query provided for user retrieval.");

    return handleDatabaseOperation(() =>
      prisma.user.findMany({
        where: query,
      })
    );
  }

  // Update a user by ID
  async update(id, data) {
    if (!data || typeof data !== "object" || !id)
      throw new Error("Invalid data provided for user update.");

    return handleDatabaseOperation(() =>
      prisma.user.update({
        where: { id },
        data,
      })
    );
  }

  // Delete a user by ID
  async delete(id) {
    if (!id) throw new Error("Invalid ID provided for user deletion.");

    return handleDatabaseOperation(() =>
      prisma.user.delete({
        where: { id },
      })
    );
  }
}

export const user = new User();