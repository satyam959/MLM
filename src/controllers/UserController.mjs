// Controllers/UserController.mjs
import UserRepository from '../Repositories/UserRepository.mjs';

class UserController {
  // User Registration
  static async registerUser(req, res) {
    const { name, fullName, email, phone, address, password, role } = req.body;
    
    const newUser = { name, fullName, email, phone, address, password, role };

    try {
      const user = await UserRepository.createUser(newUser);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }

  // User Login
  static async loginUser(req, res) {
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

      res.status(200).json({
        message: 'Login successful',
        user: { email: user.email, name: user.name },
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error logging in user',
        error: error.message,
      });
    }
  }

  // Get all users (Admin only)
  static async getAllUsers(req, res) {
    try {
      const users = await UserRepository.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }

  // Update user by ID
  static async updateUser(req, res) {
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
  static async deleteUser(req, res) {
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

export default UserController;
