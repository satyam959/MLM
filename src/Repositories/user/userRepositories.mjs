import UserModel from "../../Models/UserModels.mjs";

class userRepository {
  // Fetch user by userId
  static async findUserByUserId(userId) {
    try {
      return await UserModel.findOne({ userId: userId });
    } catch (error) {
      throw new Error(`Error fetching user with userId ${userId}: ${error.message}`);
    }
  }

  // Get downline users for a given user
  static async getUserDownlines(userId) {
    try {
      return await UserModel.find({
        hierarchy: userId  // Finds users whose hierarchy contains the given userId
      }).select("fullName userId state level referredBy status createdAt");
    } catch (error) {
      console.error("Error fetching downline:", error.message);
      throw new Error(`Error fetching downline: ${error.message}`);
    }
  }

  // Get user details by userId
  static async getUserDetails(userId) {
    try {
      return await UserModel.findOne({ userId: userId });
    } catch (error) {
      console.error('Error finding user by userId:', error.message);
      throw new Error(`Failed to find user by userId: ${error.message}`);
    }
  }

  // Get total count of downlines based on userId (active and inactive)
  static async getTotalCountUserDownlines(userId) {
    try {
      const result = await UserModel.aggregate([
        { $match: { hierarchy: userId } }, // Match users whose hierarchy contains userId
        {
          $group: {
            _id: "$status", // Group by status (active/inactive)
            count: { $sum: 1 }
          }
        }
      ]);

      let total = 0;
      let active = 0;
      let nonActive = 0;

      result.forEach((item) => {
        total += item.count;
        if (item._id === true) active = item.count;
        else nonActive = item.count;
      });

      return { total, active, nonActive };
    } catch (error) {
      console.error("Error fetching downline counts:", error.message);
      throw new Error(`Error fetching downline counts: ${error.message}`);
    }
  }

  // Fetch admin userId
  static async getAdminUserId() {
    try {
      const admin = await UserModel.findOne({ role: 'admin' }).select('userId');
      return admin ? admin.userId : null;
    } catch (error) {
      console.error('Error finding admin userId:', error.message);
      throw new Error(`Failed to find admin userId: ${error.message}`);
    }
  }

  // Get total count of users and their levels
  static async getTotalTeamByLevel(userId) {
    try {
      const user = await UserModel.findOne({ userId: userId });
      if (!user) throw new Error("User not found");

      const basePath = user.hierarchy || [];
      const baseDepth = basePath.length;

      const result = await UserModel.aggregate([
        {
          $match: {
            hierarchy: { $ne: null },
            hierarchy: { $elemMatch: { $eq: userId } }
          }
        },
        {
          $addFields: {
            level: {
              $subtract: [
                { $size: "$hierarchy" },
                baseDepth
              ]
            }
          }
        },
        {
          $group: {
            _id: { level: "$level", status: "$status" },
            count: { $sum: 1 }
          }
        }
      ]);

      const levelMap = {};

      result.forEach(item => {
        const level = item._id.level;
        const status = item._id.status;

        if (!levelMap[level]) {
          levelMap[level] = {
            total: 0,
            active: 0,
            nonActive: 0
          };
        }

        levelMap[level].total += item.count;
        if (status === true) levelMap[level].active += item.count;
        else levelMap[level].nonActive += item.count;
      });

      return Object.entries(levelMap).map(([level, data]) => ({
        level: parseInt(level),
        total: data.total,
        active: data.active,
        inActive: data.nonActive
      })).sort((a, b) => a.level - b.level);
    } catch (error) {
      console.error('Error fetching team by level:', error.message);
      throw new Error(`Error fetching team by level: ${error.message}`);
    }
  }

  // Get users by level
  static async getUsersByLevel(level) {
    try {
      const users = await UserModel.find({ level });

      if (!users || users.length === 0) {
        return [];
      }

      return users;
    } catch (error) {
      console.error("Error fetching users by level:", error.message);
      throw new Error("Error fetching users by level");
    }
  }

  // Get downline users and add referrer name
  static async getUsersWithReferrerName(level) {
    try {
      const users = await UserModel.find({ level });

      if (!users || users.length === 0) {
        return [];
      }

      const formattedUsers = await Promise.all(
        users.map(async (user) => {
          const referrer = user.referredBy ? await this.findUserByUserId(user.referredBy) : null;
          const referrerName = referrer ? referrer.fullName : "Unknown";
          return {
            fullName: user.fullName,
            userId: user.userId,
            state: user.state,
            level: user.level,
            referredBy: referrerName,
            status: user.status ? "Active" : "Inactive"
          };
        })
      );

      return formattedUsers;
    } catch (error) {
      console.error("Error fetching users with referrer name:", error.message);
      throw new Error("Error fetching users with referrer name");
    }
  }
}

export default userRepository;
