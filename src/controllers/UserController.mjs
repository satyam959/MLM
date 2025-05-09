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
  //     // Check if phone already exists
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

  //     if (referralCode) {
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
  //     }

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
  //     }

  //     const wallet = await WalletRepository.createWallet({
  //       userId: user.userId,
  //       balance: 200,
  //     });

  //     if (!wallet) {
  //       return res.status(500).json({
  //         statusCode: 500,
  //         success: false,
  //         message: "User created, but wallet creation failed",
  //       });
  //     }

  //     if (user.referredBy) {
  //       const referredUserList = await UserRepository.findAllUserByReferredId(
  //         user.referredBy
  //       );
  //       const referredUserCount = referredUserList.length;

  //       let amount = 0;
  //       if (referredUserCount === 3) amount = 200;
  //       if (referredUserCount === 8) amount = 40;

  //       const userIds = referredUserList.map((u) => u.userId);
  //       await WalletRepository.updateReferredUserWallet(userIds, amount);
  //       await UserBenefits.checkReferralRewardEligibility(user.referredBy);
  //       await WalletRepository.rewardBasedOnTeamSize(user.referredBy);
  //     }

  //     // Return only selected fields
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
      let walletBalance = 0;

      let referrer = null;

      if (referralCode) {
        referrer = await UserModel.findOne({ referralCode });
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
        if (
          referrer.membership &&
          referrer.membership.toLowerCase() === "active"
        )
          walletBalance = 200;
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

      const wallet = await WalletRepository.createWallet({
        userId: user.userId,
        balance: walletBalance,
      });

      if (!wallet) {
        return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "User created, but wallet creation failed",
        });
      }

      if (user.referredBy) {
        const referredUserList = await UserRepository.findAllUserByReferredId(
          user.referredBy
        );
        const referredUserCount = referredUserList.length;

        let amount = 0;
        if (referredUserCount === 3) amount = 200;
        if (referredUserCount === 8) amount = 40;

        const userIds = referredUserList.map((u) => u.userId);
        await WalletRepository.updateReferredUserWallet(userIds, amount);
<<<<<<< HEAD
        await UserBenefits.checkReferralRewardEligibility(user.referredBy);
=======

        await UserBenefits.checkReferralRewardEligibility(user.referredBy);

>>>>>>> 75cb7ad (portfolio code added)
        await WalletRepository.rewardBasedOnTeamSize(user.referredBy);
      }

      return res.status(201).json({
        statusCode: 201,
        success: true,
        message: "User registered successfully, wallet created",
        user: {
          fullName: user.fullName,
          email: user.email,
          dob: user.dob,
          phone: user.phone,
          whatsapp: user.whatsapp,
          referralCode: user.referralCode,
          // walletBalance,
        },
      });
    } catch (error) {
      console.log("error  -- ", error);
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

<<<<<<< HEAD
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
=======
    // Validate phone number (must be 10 digits)
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });

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
  }

  // Step 2: Verify OTP and Login
  async verifyOTPLogin(req, res) {
    const { phone, otp } = req.body;

    // Validate phone number (must be 10 digits)
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
>>>>>>> 75cb7ad (portfolio code added)
    }

    try {
      const user = await UserRepository.findUserByPhone(phone);
<<<<<<< HEAD
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
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    try {
      const user = await UserRepository.findUserByPhone(phone);
      if (!user || !user.otp || !user.otpExpiry) {
        return res
          .status(400)
          .json({ message: "OTP not requested or expired" });
      }

      if (user.otp !== otp || new Date(user.otpExpiry) < new Date()) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
      }

      await UserRepository.clearOTP(user.userId);

      const payload = {
        userId: user.userId,
=======
      if (!user || !user.otp || !user.otpExpiry) {
        return res.status(400).json({ message: "OTP not requested or expired" });
      }

      if (user.otp !== otp || new Date(user.otpExpiry) < new Date()) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
      }

      await UserRepository.clearOTP(user._id);

      const payload = {
        userId: user._id,
>>>>>>> 75cb7ad (portfolio code added)
        name: user.fullName || user.name,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "365d",
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

<<<<<<< HEAD
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
=======
>>>>>>> 75cb7ad (portfolio code added)

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

  // async getUserDownline(req, res) {
  //   try {
  //     const userId = req.user.userId;
  //     const { startDate, endDate, search } = req.query;

  //     const userData = await UserRepository.findUserByUserId(userId);
  //     const hierarchy = Array.isArray(userData.hierarchy) ? userData.hierarchy : [];

  //     let downline = await UserRepository.getUserDownlines(userId, hierarchy);

  //     if (startDate && endDate) {
  //       const start = new Date(startDate);
  //       const end = new Date(endDate);
  //       end.setHours(23, 59, 59, 999);

  //       if (!isNaN(start) && !isNaN(end)) {
  //         downline = downline.filter((user) => {
  //           const createdAt = new Date(user.createdAt);
  //           return createdAt >= start && createdAt <= end;
  //         });
  //       }
  //     }

  //     if (search && search.trim() !== "") {
  //       const lowerSearch = search.toLowerCase();
  //       downline = downline.filter((user) => {
  //         const fullNameMatch = user.fullName?.toLowerCase().includes(lowerSearch);
  //         const statusLabel = user.status ? "active" : "inactive";
  //         const statusMatch = statusLabel === lowerSearch; 
  //         return fullNameMatch || statusMatch;
  //       });
  //     }

  //     if (downline.length > 0) {
  //       const formatted = downline.map((user) => ({
  //         fullName: user.fullName,
  //         userId: user.userId,
  //         level: user.level,
  //         state: user.state,
  //         status: user.status ? "Active" : "Inactive",
  //         createDate: new Date(user.createdAt).toLocaleString("en-GB", {
  //           timeZone: "Asia/Kolkata",
  //           year: "numeric",
  //           month: "short",
  //           day: "2-digit",
  //           hour: "2-digit",
  //           minute: "2-digit",
  //           hour12: true,
  //         }).replace(",", ""),
  //       }));

  //       return res.status(200).json({
  //         statusCode: 200,
  //         message: "Downline retrieved successfully",
  //         totalMember: formatted.length,
  //         data: formatted,
  //       });
  //     } else {
  //       return res.status(200).json({
  //         statusCode: 200,
  //         message: "No Downline found",
  //         data: [],
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user downline:", error);
  //     return res.status(500).json({
  //       statusCode: 500,
  //       message: "Error fetching user downline",
  //       error: error.message,
  //     });
  //   }
  // }


  async getUserDownline(req, res) {
    try {
      const userId = req.user.userId;
      const { startDate, endDate, search } = req.query;

      const userData = await UserRepository.findUserByUserId(userId);
      const hierarchy = Array.isArray(userData.hierarchy) ? userData.hierarchy : [];

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
          const fullNameMatch = user.fullName?.toLowerCase().includes(lowerSearch);
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
          createDate: new Date(user.createdAt).toLocaleString("en-GB", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).replace(",", ""),
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

      const hierarchy = Array.isArray(userData.hierarchy) ? userData.hierarchy : [];

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
          const fullNameMatch = user.fullName?.toLowerCase().includes(lowerSearch);
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
          createDate: new Date(user.createdAt).toLocaleString("en-GB", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).replace(",", ""),
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



}

export default new UserController();