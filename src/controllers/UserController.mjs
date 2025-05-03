// Controllers/UserController.mjs
import UserRepository from "../Repositories/UserRepository.mjs";
import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModels.mjs";
import WalletRepository from "../Repositories/WalletRepositories.mjs";
import IncomeLevelModel from "../Models/IncomeLevelModel.mjs";
import UserBenefits from "../services/UserBenefits.mjs";
import upload from "../middelware/UploadImage.mjs";

class UserController {
//   async registerUser(req, res) {
//     const {
//       fullName,
//       email,
//       phone,
//       address,
//       city,
//       pincode,
//       state,
//       dob,
//       whatsapp,
//       role,
//       referralCode,
//     } = req.body;

//     try {
//       // Check if email already exists
//       const existingUser = await UserRepository.findUserByPhone(phone);
//       if (existingUser) {
//         return res.status(400).json({ message: "phone already exists" });
//       }

//       let referredBy = null;
//       let referrerName = null;
//       let hierarchy = [];

//       // Handle referral code
//       if (referralCode) {
//         const referrer = await UserModel.findOne({ referralCode });

//         if (!referrer) {
//           return res.status(400).json({ message: "Invalid referral code" });
//         }

//         referredBy = referrer.userId;
//         referrerName = referrer.fullName || referrer.name || null;
//         hierarchy = [referredBy, ...(referrer.hierarchy || [])];
//       }

//       // Prepare new user data
//       const newUserData = {
//         fullName,
//         email,
//         phone,
//         address,
//         city,
//         pincode,
//         state,
//         dob,
//         whatsapp,
//         role,
//         referredBy,
//         referrerName,
//         hierarchy,
//       };

//       // Create user
//       const user = await UserRepository.createUser(newUserData);

//       if (!user || !user.userId) {
//         return res.status(500).json({ message: "User creation failed" });
//       }

//       // Create wallet
//       const initialBalance = 200;
//       const walletData = {
//         userId: user.userId,
//         balance: initialBalance,
//       };

//       const wallet = await WalletRepository.createWallet(walletData);
//       if (user.referredBy) {
//         let amount = 0;
//         const referredUserList = await UserRepository.findAllUserByReferredId(
//           user.referredBy
//         );
//         let referredUserCount = referredUserList.length;
//         console.log("referredUserCount == ", referredUserCount);

//         if (referredUserCount === 3) {
//           amount = 200;
//         }
//         if (referredUserCount === 8) {
//           amount = 40;
//         }
//         console.log("amount --", amount);

//         const userIds = referredUserList.map((user) => user.userId);
//         await WalletRepository.updateReferredUserWallet(userIds, amount);

//         await UserBenefits.checkReferralRewardEligibility(user.referredBy);

//         await WalletRepository.rewardBasedOnTeamSize(user.referredBy);
//       }

//       if (!wallet) {
//         return res
//           .status(500)
//           .json({ message: "User created, but wallet creation failed" });
//       }
//     return res.status(201).json({
//       statusCode: 201,
//       success: true,
//       message: "User registered successfully, wallet created",
//       user, 
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Error registering user",
//       error: error.message,
//     });
//   }
// }








async registerUser(req, res) {
  const {
    fullName,
    email,
    phone,
    address,
    city,
    pincode,
    state,
    dob,
    whatsapp,
    role,
    referralCode,
  } = req.body;

  const image = req.file ? req.file.filename : null; // Multer handles this

  try {
    // Check if phone already exists
    const existingUser = await UserRepository.findUserByPhone(phone);
    if (existingUser) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Phone number already exists",
      });
    }

    let referredBy = null;
    let referrerName = null;
    let hierarchy = [];

    // Handle referral code
    if (referralCode) {
      const referrer = await UserModel.findOne({ referralCode });
      if (!referrer) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: "Invalid referral code",
        });
      }

      referredBy = referrer.userId;
      referrerName = referrer.fullName || referrer.name || null;
      hierarchy = [referredBy, ...(referrer.hierarchy || [])];
    }

    // Prepare new user data
    const newUserData = {
      fullName,
      email,
      phone,
      address,
      city,
      pincode,
      state,
      dob,
      whatsapp,
      role,
      image,
      referredBy,
      referrerName,
      hierarchy,
    };

    // Create user
    const user = await UserRepository.createUser(newUserData);
    if (!user || !user.userId) {
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "User creation failed",
      });
    }

    // Create wallet
    const wallet = await WalletRepository.createWallet({
      userId: user.userId,
      balance: 200,
    });

    if (!wallet) {
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "User created, but wallet creation failed",
      });
    }

    // Handle referral rewards
    if (user.referredBy) {
      const referredUserList = await UserRepository.findAllUserByReferredId(user.referredBy);
      const referredUserCount = referredUserList.length;

      let amount = 0;
      if (referredUserCount === 3) amount = 200;
      if (referredUserCount === 8) amount = 40;

      const userIds = referredUserList.map(u => u.userId);
      await WalletRepository.updateReferredUserWallet(userIds, amount);
      await UserBenefits.checkReferralRewardEligibility(user.referredBy);
      await WalletRepository.rewardBasedOnTeamSize(user.referredBy);
    }

    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "User registered successfully, wallet created",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
}


  // Step 1: Send OTP
async requestOTP(req, res) {
  const { phone } = req.body;

  // Validate phone number (must be 10 digits)
  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Phone number must be 10 digits" });
  }

  try {
    const user = await UserRepository.findUserByPhone(phone);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await UserRepository.saveOTP(user._id, otp, otpExpiry);

    // Simulate sending OTP
    console.log(`OTP for ${phone}: ${otp}`);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error sending OTP",
      error: error.message,
    });
  }
}

// Step 2: Verify OTP and Login
async verifyOTPLogin(req, res) {
  const { phone, otp } = req.body;

  // Validate phone number (must be 10 digits)
  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Phone number must be 10 digits" });
  }

  try {
    const user = await UserRepository.findUserByPhone(phone);
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "OTP not requested or expired" });
    }

    if (user.otp !== otp || new Date(user.otpExpiry) < new Date()) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    await UserRepository.clearOTP(user._id);

    const payload = {
      userId: user._id,
      name: user.fullName || user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "9h",
    });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Login successful via OTP",
      token,
      user: {
        phone: user.phone,
        name: user.fullName || user.name,
        role: user.role,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error verifying OTP",
      error: error.message,
    });
  }
}


  // Admin: Get all users
  async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching users", error: error.message });
    }
  }

  // Update user by custom userId
  async updateUser(req, res) {
    const { userId } = req.params;
    const updateData = req.body;

    try {
      const updatedUser = await UserRepository.updateUserByUserId(
        userId,
        updateData
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }

  // Delete user by userId
  async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      const deletedUser = await UserRepository.deleteUserByUserId(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  }

  // Get user profile
  async getUserProfile(req, res) {
    const { userId } = req.params;
  
    try {
      const user = await UserRepository.findUserByUserId(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const {
        userId: uId, 
        fullName,
        phone,
        email,
        companyName,
        address,
        city,
        state,
        country,
        pinCode,
        image,
      } = user;
  
      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "User profile fetched successfully",
        user: {
          userId: uId,
          fullName,
          phone,
          email,
          companyName,
          address,
          city,
          state,
          country,
          pinCode,
          image,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching user profile",
        error: error.message,
      });
    }
  }
  
  

  // Update profile
  async updateProfile(req, res) {
    const { userId } = req.params;
    const updateData = req.body;
  
    try {
      // If image is uploaded via multer, include its path
      if (req.file) {
        updateData.image = req.file.path; // Or construct a URL if serving statically
      }
  
      const updatedUser = await UserRepository.updateUserByUserId(userId, updateData);
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Extract only required fields
      const {
        fullName,
        phone,
        email,
        companyName,
        address,
        city,
        state,
        country,
        pinCode,
        image,
      } = updatedUser;
  
      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Profile updated successfully",
        user: {
          fullName,
          phone,
          email,
          companyName,
          address,
          city,
          state,
          country,
          pinCode,
          image,
        },
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Error updating profile",
        error: error.message,
      });
    }
  }
  

  // Delete profile
  async deleteProfile(req, res) {
    const { userId } = req.params;

    try {
      const deletedUser = await UserRepository.deleteUserByUserId(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting profile", error: error.message });
    }
  }

  // Get user by referral code
  async getUserByReferralCode(req, res) {
    const { referralCode } = req.params;

    try {
      const user = await UserRepository.findUserByReferralCode(referralCode);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found with this referral code" });
      }

      const { password, ...safeUserData } = user.toObject();
      res.status(200).json({
        message: "User fetched successfully by referral code",
        user: safeUserData,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching user by referral code",
        error: error.message,
      });
    }
  }

  // upline
  async getUserUpline(req, res) {
    try {
      const { userId } = req.params;
      const userData = await UserRepository.findUserByUserId(userId);
      const uplines = await UserRepository.getUserUplines(
        userId,
        userData.hierarchy
      );

      res.status(200).json({
        message: "Upline retrieved successfully",
        data: uplines,
      });
    } catch (error) {
      console.error("Error fetching user upline:", error.message);
      res.status(500).json({
        message: "Error fetching user upline",
        error: error.message,
      });
    }
  }

  // downline
  async getUserDownline(req, res) {
    try {
      const { userId } = req.params;
      const userData = await UserRepository.findUserByUserId(userId);
      const downline = await UserRepository.getUserDownlines(
        userId,
        userData.hierarchy
      );
      if (downline.length > 0) {
        res.status(200).json({
          message: "Downline retrieved successfully",
          data: downline,
        });
      } else {
        res.status(200).json({
          message: "No Downline found",
          data: [],
        });
      }
    } catch (error) {
      console.error("Error fetching user upline:", error.message);
      res.status(500).json({
        message: "Error fetching user upline",
        error: error.message,
      });
    }
  }
}

export default new UserController();
