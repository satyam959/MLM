// Controllers/UserController.mjs
import UserRepository from "../Repositories/UserRepository.mjs";
import jwt from "jsonwebtoken";
import UserModel from "../Models/UserModels.mjs";
import WalletRepository from "../Repositories/WalletRepositories.mjs";
import IncomeLevelModel from "../Models/IncomeLevelModel.mjs";
import UserBenefits from "../services/UserBenefits.mjs";
// import upload from "../middelware/UploadImage.mjs";
import { getUploadMiddleware } from "../middelware/UploadImage.mjs";

class UserController {
  // async registerUser(req, res) {
  //   const {
  //     fullName,
  //     email,
  //     phone,
  //     address,
  //     city,
  //     pincode,
  //     state,
  //     dob,
  //     whatsapp,
  //     role,
  //     referralCode,
  //   } = req.body;

  //   const image = req.file ? req.file.fullUrl : null;

  //   try {
  //     const existingUser = await UserRepository.findUserByPhone(phone);
  //     if (existingUser) {
  //       return res.status(400).json({
  //         statusCode: 400,
  //         success: false,
  //         message: "Phone number already exists",
  //       });
  //     }

  //     let referredBy = null;
  //     let referrerName = null;
  //     let hierarchy = [];
  //     let walletBalance = 0;
  //     let level = 1; // Default level is always 1

  //     if (referralCode) {
  //       console.log("1111");
  //       const referrer = await UserModel.findOne({ referralCode });

  //       if (!referrer) {
  //         return res.status(400).json({
  //           statusCode: 400,
  //           success: false,
  //           message: "Invalid referral code",
  //         });
  //       }

  //       referredBy = referrer.userId;
  //       referrerName = referrer.fullName || referrer.name || null;
  //       hierarchy = [referredBy, ...(referrer.hierarchy || [])];

  //       // ✅ If referrer has level >= 1, assign new level = referrer.level + 1
  //       // if (typeof referrer.level === "number" && referrer.level >= 1) {
  //       level = referrer.level + 1;
  //       // }
  //       console.log("level 64--", level);

  //       // // ✅ If referrer has active membership, give wallet bonus
  //       // if (
  //       //   referrer.membership &&
  //       //   typeof referrer.membership === "object" &&
  //       //   referrer.membership.status &&
  //       //   referrer.membership.status.toLowerCase() === "active"
  //       // ) {
  //       //   walletBalance = 200;
  //       // }

  //       // ✅ Ensure referrer level is at least 1
  //     }
  //     console.log("22222");

  //     const newUserData = {
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
  //       image,
  //       referredBy,
  //       referrerName,
  //       hierarchy,
  //     };

  //     const user = await UserRepository.createUser(newUserData);
  //     if (!user || !user.userId) {
  //       return res.status(500).json({
  //         statusCode: 500,
  //         success: false,
  //         message: "User creation failed",
  //       });
  //     } else {
  //       console.log("userId --", user.userId);
  //       console.log("level 107 --", level);

  //       await UserModel.updateOne(
  //         { userId: user.userId },
  //         { $set: { level: level } }
  //       );
  //     }
  //     // ✅ Fetch full latest user from DB
  //     const savedUser = await UserModel.findOne({ userId: user.userId });

  //     return res.status(201).json({
  //       statusCode: 201,
  //       success: true,
  //       message: "User registered successfully, wallet created",
  //       user: {
  //         fullName: user.fullName,
  //         email: user.email,
  //         dob: user.dob,
  //         phone: user.phone,
  //         whatsapp: user.whatsapp,
  //         referralCode: user.referralCode,
  //         level: savedUser.level,
  //       },
  //     });
  //   } catch (error) {
  //     console.log("error  -- ", error);
  //     return res.status(500).json({
  //       statusCode: 500,
  //       success: false,
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
  
    const image = req.file ? req.file.fullUrl : null;
  
    try {
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
      let level = 1; // Default level is 1
  
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
  
        // ✅ Corrected level logic
        if (!referrer.hierarchy || referrer.hierarchy.length === 0) {
          level = 1;
        } else {
          level = (typeof referrer.level === "number" && referrer.level >= 1)
            ? referrer.level + 1
            : 2;
        }
      }
  
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
  
      const user = await UserRepository.createUser(newUserData);
      if (!user || !user.userId) {
        return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "User creation failed",
        });
      }
  
      // Update level
      await UserModel.updateOne(
        { userId: user.userId },
        { $set: { level: level } }
      );
  
      const savedUser = await UserModel.findOne({ userId: user.userId });
  
      return res.status(201).json({
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        user: {
          fullName: savedUser.fullName,
          email: savedUser.email,
          dob: savedUser.dob,
          phone: savedUser.phone,
          whatsapp: savedUser.whatsapp,
          referralCode: savedUser.referralCode,
          level: savedUser.level,
        },
      });
    } catch (error) {
      console.log("error --", error);
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
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
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

    // Validate input
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: "OTP must be a 6-digit code" });
    }

    try {
      const user = await UserRepository.findUserByPhone(phone);

      if (!user || !user.otp || !user.otpExpiry) {
        return res
          .status(400)
          .json({ message: "OTP not requested or expired" });
      }

      // Check OTP and expiry
      const now = new Date();
      const otpExpiry = new Date(user.otpExpiry);

      if (user.otp !== otp) {
        return res.status(401).json({ message: "Invalid OTP" });
      }

      if (otpExpiry < now) {
        return res.status(401).json({ message: "OTP has expired" });
      }

      // Clear OTP after successful login
      await UserRepository.clearOTP(user._id);

      // Create JWT payload
      const payload = {
        userId: user.userId,
        name: user.fullName || user.name,
        role: user.role,
      };

      // Sign JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });

      // Success response
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
      console.error("Error verifying OTP:", error);
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
  async updateProfile(req, res) {
    const { userId } = req.user;
    const updateData = { ...req.body };

    try {
      if (req.file) {
        updateData.image = req.file.fullUrl;
      }

      const updatedUser = await UserRepository.updateUserByUserId(
        userId,
        updateData
      );

      if (!updatedUser) {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: "User not found",
        });
      }

      const {
        fullName,
        phone,
        email,
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
    const { userId } = req.user;
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
        referralCode,
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
          referralCode,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching user profile",
        error: error.message,
      });
    }
  }

  /// Delete profile
  async deleteProfile(req, res) {
    const { userId } = req.user;

    try {
      const deletedUser = await UserRepository.deleteUserByUserId(userId);

      if (!deletedUser) {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Profile deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Error deleting profile",
        error: error.message,
      });
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
  /////////////////// This use for Admin Only ////////////////////////

  async getUserDownline(req, res) {
    try {
      const { userId, startDate, endDate, search } = req.query;

      if (!userId) {
        return res.status(400).json({
          statusCode: 400,
          message: "User ID is required",
        });
      }

      const userData = await UserRepository.findUserByUserId(userId);
      if (!userData) {
        return res.status(404).json({
          statusCode: 404,
          message: "User not found",
        });
      }

      const hierarchy = Array.isArray(userData.hierarchy)
        ? userData.hierarchy
        : [];

      let downline = await UserRepository.getUserDownlines(userId, hierarchy);

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (!isNaN(start) && !isNaN(end)) {
          downline = downline.filter((user) => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= start && createdAt <= end;
          });
        }
      }

      if (search && search.trim() !== "") {
        const lowerSearch = search.toLowerCase();
        downline = downline.filter((user) => {
          const fullNameMatch = user.fullName
            ?.toLowerCase()
            .includes(lowerSearch);
          const statusLabel = user.status ? "active" : "inactive";
          const statusMatch = statusLabel === lowerSearch;
          const userIdMatch = user.userId.toString() === search;
          return fullNameMatch || statusMatch || userIdMatch;
        });
      }

      if (downline.length > 0) {
        const formatted = downline.map((user) => ({
          fullName: user.fullName,
          userId: user.userId,
          level: user.level,
          state: user.state,
          status: user.status ? "Active" : "Inactive",
          createDate: new Date(user.createdAt)
            .toLocaleString("en-GB", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .replace(",", ""),
        }));

        return res.status(200).json({
          statusCode: 200,
          message: "Downline retrieved successfully",
          totalMember: formatted.length,
          data: formatted,
        });
      } else {
        return res.status(200).json({
          statusCode: 200,
          message: "No Downline found",
          data: [],
        });
      }
    } catch (error) {
      console.error("Error fetching user downline:", error);
      return res.status(500).json({
        statusCode: 500,
        message: "Error fetching user downline",
        error: error.message,
      });
    }
  }

  async resendOTP(req, res) {
    const { phone } = req.body;

    // Validate phone number
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    try {
      const user = await UserRepository.findUserByPhone(phone);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a new OTP and expiry time
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await UserRepository.saveOTP(user._id, newOtp, otpExpiry);

      // Simulate sending OTP
      console.log(`Resent OTP for ${phone}: ${newOtp}`);

      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "OTP resent successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error resending OTP",
        error: error.message,
      });
    }
  }
  // Get users by rank
  async getUsersByRank(req, res) {
    try {
      const { rank } = req.query;

      if (!rank) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: "Rank parameter is required",
        });
      }

      const users = await UserModel.find({ rank });

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Users fetched by rank successfully",
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users by rank:", error.message);
      res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Error fetching users by rank",
        error: error.message,
      });
    }
  }
  
}

export default new UserController();
