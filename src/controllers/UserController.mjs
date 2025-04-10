// Controllers/UserController.mjs
import UserRepository from '../Repositories/UserRepository.mjs';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

class UserController {
  // User Registration
  async registerUser(req, res) {
    const { name, fullName, email, phone, address, password, role } = req.body;

    const newUser = { name, fullName, email, phone, address, password, role };

    try {
      // Check if the email already exists
      const existingUser = await UserRepository.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const user = await UserRepository.createUser(newUser);
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

      // Generate a JWT token
      const payload = {
        userId: user._id,  // Include user ID in payload (or any other information you need)
        name: user.name,
        role: user.role,
      };

      // Sign the token (expires in 1 hour)
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '9h' });

      res.status(200).json({
        message: 'Login successful',
        token, // Send token back to the user
        user: { email: user.email, name: user.name, role: user.role },
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error logging in user',
        error: error.message,
      });
    }
  }

  // Get all users (Admin only)
  async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }

  // Update user by ID
  async updateUser(req, res) {
    const { userId } = req.params;
    const updateData = req.body;

    try {
      const updatedUser = await UserRepository.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  }

  // Delete user by ID
  async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      const deletedUser = await UserRepository.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
}

export default new UserController();
