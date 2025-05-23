import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user } from "../models/db/user";

const JWT_SECRET = "42819ee6-70c3-4e22-8b2c-e13973fce55e"; // Substitua por uma chave secreta segura
const JWT_EXPIRATION = "1h"; // Tempo de expiração do token

class UserController {
  async register(userData) {
    try {
      // Validate userData
      if (!userData || typeof userData !== "object") {
        return { status: 400, message: "Invalid user data provided." };
      }

      // Check if user already exists
      const existingUser = await user.getByQuery({
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
      const newUserResult = await user.create(newUser);
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
        return { status: 400, message: "Email and password are required." };
      }

      // Find user by email
      const [existingUser] = await user.getByQuery({ email });
      if (!existingUser) {
        return { status: 404, message: "User not found." };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return { status: 401, message: "Invalid credentials." };
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
      const token = jwt.sign({ id: userData.id, email: userData.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });

      return {
        user: {
          id: userData.id,
          email: userData.email,
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