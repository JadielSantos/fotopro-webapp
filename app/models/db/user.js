import prisma from "../../db.server";
import { handleDatabaseOperation } from "../../utils/util.ts";

export default class UserService {
  // Create a new user
  static async create(data) {
    if (!data || typeof data !== "object")
      throw new Error("Invalid data provided for user creation.");

    return handleDatabaseOperation(() => prisma.user.create({ data }));
  }

  // Get all users
  static async getAll() {
    return handleDatabaseOperation(() => prisma.user.findMany());
  }

  // Get a single user by ID
  static async getById(id) {
    if (!id) throw new Error("Invalid ID provided for user retrieval.");

    return handleDatabaseOperation(() =>
      prisma.user.findUnique({
        where: { id },
      })
    );
  }

  // Update a user by ID
  static async update(id, data) {
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
  static async delete(id) {
    if (!id) throw new Error("Invalid ID provided for user deletion.");

    return handleDatabaseOperation(() =>
      prisma.user.delete({
        where: { id },
      })
    );
  }
}
