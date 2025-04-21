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

      // Generate a referral code if it's not provided
      if (!userData.referralCode) {
        userData.referralCode = generateReferralCode();
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


//  async updateUserByUserId(userId, updateData) {
//    return await User.findOneAndUpdate({ userId: userId }, updateData, { new: true });
//  }


  // Update user details
  static async updateUser(userId, updateData) {
    try {
      // If you want to update the referral code, ensure it's unique
      if (updateData.referralCode) {
        const existingReferral = await UserModel.findOne({ referralCode: updateData.referralCode });
        if (existingReferral) {
          throw new Error('Referral code must be unique');
        }
      }

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


  static async findUserByUserId(userId) {
    try {
      return await UserModel.findOne({ userId: userId }); // assuming userId is a custom field
    } catch (error) {
      console.error('Error finding user by userId:', error.message);
      throw new Error(`Failed to find user by userId: ${error.message}`);
    }
  }
  
  static async updateUserByUserId(userId, updateData) {
    try {
      return await UserModel.findOneAndUpdate({ userId: userId }, updateData, { new: true });
    } catch (error) {
      console.error('Error updating user by userId:', error.message);
      throw new Error(`Failed to update user by userId: ${error.message}`);
    }
  }
}  



function generateReferralCode() {
  // Generate a random 8-character long referral code
  let referralCode = Math.random().toString(36).substr(2, 8).toUpperCase();

  // Ensure the referral code has exactly 8 characters (if the random string is too short)
  while (referralCode.length < 8) {
    referralCode = Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  // Return the referral code
  return referralCode;
}

 

export default UserRepository;
