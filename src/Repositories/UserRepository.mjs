// Repositories/UserRepository.mjs
import UserModel from "../Models/UserModels.mjs";

class UserRepository {
  // Create a new user
  static async createUser(userData) {
    try {
      const existingUser = await UserModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email is already in use');
      }
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Find a user by email
  static async findUserByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Find a user by ID
  static async findUserById(userId) {
    try {
      return await UserModel.findById(userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update user details
  static async updateUser(userId, updateData) {
    try {
      return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete a user by ID
  static async deleteUser(userId) {
    try {
      return await UserModel.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all users (for Admin to view all users)
  static async getAllUsers() {
    try {
      return await UserModel.find();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default UserRepository;
