import UserModel from "../Models/UserModels.mjs";

class UserRepository {
  // Create a new user
  static async createUser(userData) {
    try {
      // Check if the email is already taken
      const existingUser = await UserModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email is already in use');
      }
      
      // Create a new user instance
      const user = new UserModel(userData);

      // Save the new user to the database
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error.message); // Log the error
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  // Find a user by email
  static async findUserByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  // Find a user by ID
  static async findUserById(userId) {
    try {
      return await UserModel.findById(userId);
    } catch (error) {
      console.error('Error finding user by ID:', error.message);
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  }

  // Update user details
  static async updateUser(userId, updateData) {
    try {
      // Update the user by ID with the provided data
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete a user by ID
  static async deleteUser(userId) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new Error('User not found');
      }
      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Get all users (for Admin to view all users)
  static async getAllUsers() {
    try {
      return await UserModel.find();
    } catch (error) {
      console.error('Error fetching all users:', error.message);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }
}

export default UserRepository;
