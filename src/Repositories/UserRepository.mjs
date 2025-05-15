import UserModel from "../Models/UserModels.mjs";
import WalletModel from "../Models/WalletModels.mjs";

class UserRepository {
  // Method to find user by phone
  static async findUserByPhone(phone) {
    try {
      return await UserModel.findOne({ phone });
    } catch (error) {
      console.error("Error finding user by phone:", error.message);
      throw new Error(`Failed to find user by phone: ${error.message}`);
    }
  }

  // Static method to find user by userId
  static async findByUserId(userId) {
    try {
      return await UserModel.findOne({ userId });
    } catch (error) {
      console.error("Error fetching user by userId:", error.message);
      throw new Error(`Failed to fetch user by userId: ${error.message}`);
    }
  }
  // Create a new user
  static async createUser(userData) {
    try {
      const existingUser = await UserModel.findOne({ phone: userData.phone });
      if (existingUser) {
        throw new Error("Phone is already in use");
      }

      if (!userData.referralCode) {
        userData.referralCode = generateReferralCode();
      }

      const newUser = new UserModel(userData);
      return await newUser.save();
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  // Update a user by userId
  static async updateUserByUserId(userId, updateData) {
    try {
      return await UserModel.findOneAndUpdate({ userId }, updateData, { new: true });
    } catch (error) {
      console.error("Error updating user by userId:", error.message);
      throw new Error(`Failed to update user by userId: ${error.message}`);
    }
  }

  // Delete a user by userId
  static async deleteUserByUserId(userId) {
    try {
      return await UserModel.findOneAndDelete({ userId });
    } catch (error) {
      console.error("Error deleting user by userId:", error.message);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Update a user
  static async updateUser(userId, updateData) {
    try {
      if (updateData.referralCode) {
        const existingReferral = await UserModel.findOne({ referralCode: updateData.referralCode });
        if (existingReferral) {
          throw new Error("Referral code must be unique");
        }
      }

      const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error.message);
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete a user by ID
  static async deleteUser(userId) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(userId);
      if (!deletedUser) throw new Error("User not found");
      return deletedUser;
    } catch (error) {
      console.error("Error deleting user:", error.message);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Get all users
  static async getAllUsers() {
    try {
      return await UserModel.find();
    } catch (error) {
      console.error("Error fetching all users:", error.message);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  // Get user by userId
  static async findUserByUserId(userId) {
    try {
      return await UserModel.findOne({ userId: userId });
    } catch (error) {
      throw new Error("Error fetching user from the database");
    }
  }

  // Get user by referral code
  static async findUserByReferralCode(referralCode) {
    try {
      return await UserModel.findOne({ referralCode });
    } catch (error) {
      console.error("Error finding user by referral code:", error.message);
      throw new Error(`Failed to find user by referral code: ${error.message}`);
    }
  }

  // Get uplines for a user
  static async getUserUplines(userId, hierarchy) {
    try {
      return await UserModel.find({ userId: { $in: hierarchy } }).select("name");
    } catch (error) {
      console.error("Error fetching upline names:", error.message);
      throw new Error(`Error fetching upline names: ${error.message}`);
    }
  }

  // Get downlines for a user
  static async getUserDownlines(userId) {
    try {
      return await UserModel.find({
        hierarchy: userId  // Finds users who have this userId in their hierarchy
      }).select("fullName userId state level createdAt status");
    } catch (error) {
      console.error("Error fetching downline:", error.message);
      throw new Error(`Error fetching downline: ${error.message}`);
    }
  }

  // OTP Operations
  static async saveOTP(userId, otp, expiry) {
    try {
      return await UserModel.findByIdAndUpdate(userId, { otp, otpExpiry: expiry });
    } catch (error) {
      console.error("Error saving OTP:", error.message);
      throw new Error(`Failed to save OTP: ${error.message}`);
    }
  }

  static async clearOTP(userId) {
    try {
      return await UserModel.findOneAndUpdate(
        { _id: userId },
        { $unset: { otp: "", otpExpiry: "" } },
        { new: true }
      );
    } catch (error) {
      console.error("Error clearing OTP:", error.message);
      throw new Error(`Failed to clear OTP: ${error.message}`);
    }
  }

  // Wallet Operations
  static async createWallet(walletData) {
    try {
      const wallet = new WalletModel(walletData);
      return await wallet.save();
    } catch (error) {
      console.error("Error creating wallet:", error.message);
      throw new Error("Error creating wallet");
    }
  }

  static async findWalletByUserId(userId) {
    try {
      return await WalletModel.findOne({ userId });
    } catch (error) {
      console.error("Error finding wallet:", error.message);
      throw new Error("Error finding wallet");
    }
  }

  // UserRepository.js
static async getUsersByRank({ rankId }) {
  if (!rankId) {
    throw new Error("rankId is required");
  }

  try {
    const users = await UserModel.find({ rankId });
    return users;
  } catch (error) {
    console.error("Error in getUsersByRank:", error.message);
    throw new Error("Failed to fetch users by rankId");
  }
}

  static async findAllUserByReferredId(referredBy) {
    try {
      return await UserModel.find({ referredBy }).select("userId");
    } catch (error) {
      console.error("Error finding referred users:", error.message);
      throw new Error("Error finding referred users");
    }
  }

  static async updateReferredUserWallet(userIds, amount) {
    try {
      return await WalletModel.updateMany(
        { userId: { $in: userIds } },
        { $inc: { balance: amount } }
      );
    } catch (error) {
      console.error("Error updating referred user wallets:", error.message);
      throw new Error("Error updating referred user wallets");
    }
  }
}

// Generate Referral Code
function generateReferralCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

export default UserRepository;
