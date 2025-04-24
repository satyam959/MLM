import UserPlan from '../Models/UserPlanModel.mjs';  // Your UserPlan model

class UserPlanRepository {
  // Create a new user plan
  async createUserPlan(data) {
    try {
      const userPlan = await UserPlan.create(data);  // Pass data from controller
      return userPlan;
    } catch (error) {
      throw new Error(`Error creating user plan: ${error.message}`);
    }
  }

  // Get all user plans
  async getAllUserPlans() {
    try {
      const userPlans = await UserPlan.find();
      return userPlans;
    } catch (error) {
      throw new Error(`Error fetching user plans: ${error.message}`);
    }
  }

  // Get a user plan by userId
  async getUserPlanById(userId) {
    try {
      const userPlan = await UserPlan.findOne({ userId });
      if (!userPlan) throw new Error('User Plan not found');
      return userPlan;
    } catch (error) {
      throw new Error(`Error fetching user plan: ${error.message}`);
    }
  }

  // Update a user plan by userId
  async updateUserPlan(userId, data) {
    try {
      const updatedUserPlan = await UserPlan.findOneAndUpdate({ userId }, data, { new: true });
      if (!updatedUserPlan) throw new Error('User Plan not found');
      return updatedUserPlan;
    } catch (error) {
      throw new Error(`Error updating user plan: ${error.message}`);
    }
  }

  // Delete a user plan by userId
  async deleteUserPlan(userId) {
    try {
      const deletedUserPlan = await UserPlan.findOneAndDelete({ userId });
      if (!deletedUserPlan) throw new Error('User Plan not found');
      return deletedUserPlan;
    } catch (error) {
      throw new Error(`Error deleting user plan: ${error.message}`);
    }
  }
}

export default new UserPlanRepository();
