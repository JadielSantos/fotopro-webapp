import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET; // Substitua por uma chave secreta segura
const JWT_EXPIRATION = process.env.JWT_EXPIRATION; // Tempo de expiração do token

class UserController {
  async update(id, data) {
    try {
      // Validate input data
      if (!data || typeof data !== "object" || !id) {
        return { status: 400, message: "Dados inválidos.", error: true };
      }
      // Check if user exists
      const existingUser = await userModel.getById(id);
      if (!existingUser) {
        return { status: 404, message: "Usuário não encontrado.", error: true };
      }

      // Update user data
      const updatedUser = await userModel.update(id, data);
      if (!updatedUser) {
        return { status: 500, message: "Não foi possível atualizar o usuário.", error: true };
      }

      // Return updated user data without password
      const { password, ...userData } = updatedUser;
      return { status: 200, data: userData };
    } catch (error) {
      return { status: 500, message: "Internal server error.", error: true };
    }
  }

  async getById(id, { includePhotosSelections = false, includeEvents = false } = {}) {
    try {
      // Validate ID
      if (!id) {
        return { status: 400, message: "Dados inválidos.", error: true };
      }
      // Fetch user by ID
      const user = await userModel.getById(id, {
        includePhotosSelections,
        includeEvents,
      });
      if (!user) {
        return { status: 404, message: "Usuário não encontrado.", error: true };
      }
      // Return user data without password
      const { password, ...userData } = user;
      return { status: 200, data: userData };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return { status: 500, message: "Internal server error.", error: true };
    }
  }

  async register(userData) {
    try {
      // Validate userData
      if (!userData || typeof userData !== "object") {
        return { status: 400, message: "Invalid user data provided." };
      }

      // Check if user already exists
      const existingUser = await userModel.getByQuery({
        email: userData.email,
      });

      if (existingUser.length > 0) {
        return { status: 409, message: "User already exists." };
      }

      // Create new user
      const { password, ...rest } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        ...rest,
        password: hashedPassword,
      };

      // Save the new user to the database
      const newUserResult = await userModel.create(newUser);
      if (!newUserResult) {
        console.error("Failed to create user:", newUserResult);
        throw new Error("Failed to create user.");
      }

      // Generate login data
      const loginData = await this.createLoginData(newUserResult);
      if (!loginData) {
        console.error("Failed to generate login data:", loginData);
        throw new Error("Failed to generate login data.");
      }

      // Return the login data
      return { status: 201, data: loginData };
    } catch (error) {
      return { status: 500, message: error.message, error: true };
    }
  }

  async login(email, password) {
    try {
      // Validate input
      if (!email || !password) {
        return { status: 400, message: "Email and password are required.", error: true };
      }

      // Find user by email
      const [existingUser] = await userModel.getByQuery({ email });
      if (!existingUser) {
        return { status: 404, message: "User not found.", error: true };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        return { status: 401, message: "Invalid credentials.", error: true };
      }

      // Generate login data
      const loginData = await this.createLoginData(existingUser);
      return { status: 200, data: loginData };
    } catch (error) {
      return { status: 500, message: error.message, error: true };
    }
  }

  async createLoginData(userData) {
    try {
      // Generate a JWT token
      const token = jwt.sign(
        { 
          id: userData.id, 
          email: userData.email,
          role: userData.role,
          name: userData.name
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRATION,
        }
      );

      return {
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          name: userData.name,
        },
        authToken: token,
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message,
        error: true,
      };
    }
  }

  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return { status: 200, data: decoded };
    } catch (error) {
      return { status: 401, message: "Invalid or expired token.", error: true };
    }
  }
}

export const userController = new UserController();
