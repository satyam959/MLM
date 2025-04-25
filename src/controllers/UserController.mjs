// Controllers/UserController.mjs
import UserRepository from '../Repositories/UserRepository.mjs';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/UserModels.mjs';

class UserController {
  // async registerUser(req, res) {
  //   const {
  //     name,
  //     fullName,
  //     email,
  //     phone,
  //     address,
  //     city,
  //     pincode,
  //     state,
  //     password,
  //     role,
  //     companyName,
  //     referralCode
  //   } = req.body;
  
  //   try {
    
  //     const existingUser = await UserRepository.findUserByEmail(referralCode);
  //     if (existingUser) {
  //       return res.status(400).json({ message: 'Email already exists' });
  //     }
  
     
  //     let referredBy = null;
  //     if (referralCode) {
  //       const referrer = await UserModel.findOne({ referralCode });  
  //       if (!referrer) {
  //         return res.status(400).json({ message: 'Invalid referral code' });
  //       }
  //       referredBy = referrer.userId;
  //     }
  
     
  //     const newUserData = {
  //       name,
  //       fullName,
  //       email,
  //       phone,
  //       address,
  //       city,
  //       pincode,
  //       state,
  //       password,
  //       role,
  //       companyName,
  //       referredBy,
  //       referraName
  //     };
  
  //     const user = await UserRepository.createUser(newUserData);
  //     res.status(201).json({ message: 'User registered successfully', user });
      
  //   } catch (error) {
  //     res.status(500).json({ message: 'Error registering user', error: error.message });
  //   }
  // }

  async registerUser(req, res) {
    const {
      name,
      fullName,
      email,
      phone,
      address,
      city,
      pincode,
      state,
      password,
      role,
      companyName,
      referralCode
    } = req.body;
  
    try {
      const existingUser = await UserRepository.findUserByEmail(referralCode);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      let referredBy = null;
      let referrerName = null;
      let hierarchy = [];
      if (referralCode) {
        const referrer = await UserModel.findOne({ referralCode });  
        if (!referrer) {
          return res.status(400).json({ message: 'Invalid referral code' });
        }
        referredBy = referrer.userId;
        referrerName = referrer.fullName || referrer.name || null; // adjust based on your schema
        hierarchy = [referredBy, ...(referrer.hierarchy || [])]
      }
  
      const newUserData = {
        name,
        fullName,
        email,
        phone,
        address,
        city,
        pincode,
        state,
        password,
        role,
        companyName,
        referredBy,
        referrerName,
        hierarchy
      };
  
      const user = await UserRepository.createUser(newUserData);
      res.status(201).json({ message: 'User registered successfully', user });
  
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }
  





  // User Login
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserRepository.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const payload = {
        userId: user._id,
        name: user.name,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '9h' });

      res.status(200).json({
        message: 'Login successful',
        token,
        user: { email: user.email, name: user.name, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
  }

  // Admin: Get all users
  async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }

  // Update user by custom userId
  async updateUser(req, res) {
    const { userId } = req.params;
    const updateData = req.body;

    try {
      const updatedUser = await UserRepository.updateUserByUserId(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  }

  // Delete user by userId
  async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      const deletedUser = await UserRepository.deleteUserByUserId(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }

  // Get user profile
  async getUserProfile(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserRepository.findUserByUserId(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...safeUserData } = user.toObject();
      res.status(200).json({
        message: 'User profile fetched successfully',
        user: safeUserData
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  }

  // Update profile
  async updateProfile(req, res) {
    const { userId } = req.params;
    const updateData = req.body;

    try {
      const updatedUser = await UserRepository.updateUserByUserId(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...safeUserData } = updatedUser.toObject();
      res.status(200).json({ message: 'Profile updated successfully', user: safeUserData });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  }

  // Delete profile
  async deleteProfile(req, res) {
    const { userId } = req.params;

    try {
      const deletedUser = await UserRepository.deleteUserByUserId(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
  }

  // Get user by referral code
  async getUserByReferralCode(req, res) {
    const { referralCode } = req.params;

    try {
      const user = await UserRepository.findUserByReferralCode(referralCode);
      if (!user) {
        return res.status(404).json({ message: 'User not found with this referral code' });
      }

      const { password, ...safeUserData } = user.toObject();
      res.status(200).json({
        message: 'User fetched successfully by referral code',
        user: safeUserData
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user by referral code', error: error.message });
    }
  }

  // upline
  async getUserUpline(req, res) {
    try {
      const { userId } = req.params;
      const userData = await UserRepository.findUserByUserId(userId);
      const uplines = await UserRepository.getUserUplines(userId, userData.hierarchy);
      
      res.status(200).json({
        message: 'Upline retrieved successfully',
        data: uplines
      });
    } catch (error) {
      console.error('Error fetching user upline:', error.message);
      res.status(500).json({
        message: 'Error fetching user upline',
        error: error.message
      });
    }
  }

  // downline
  async getUserDownline(req, res) {
    try {
      const { userId } = req.params;
      const userData = await UserRepository.findUserByUserId(userId);
      const downline = await UserRepository.getUserDownlines(userId, userData.hierarchy);
      if(downline.length > 0) {
        res.status(200).json({
          message: 'Downline retrieved successfully',
          data: downline
        });
      } else {
        res.status(200).json({
          message: 'No Downline found',
          data: []
        });

      }
    
    } catch (error) {
      console.error('Error fetching user upline:', error.message);
      res.status(500).json({
        message: 'Error fetching user upline',
        error: error.message
      });
    }
  }
}

export default new UserController();
