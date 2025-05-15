// import UserModel from "../../Models/UserModels.mjs";

// class userRepository {

//     static async getUserDetails(userId) {
//         try {
//             return await UserModel.findOne({ userId: userId }); // assuming userId is a custom field
//         } catch (error) {
//             console.error('Error finding user by userId:', error.message);
//             throw new Error(`Failed to find user by userId: ${error.message}`);
//         }
//     }

//     static async getTotalCountUserDownlines(userId) {
//         try {
//             const result = await UserModel.aggregate([
//                 { $match: { hierarchy: userId } },
//                 {
//                     $group: {
//                         _id: '$status', // true = active, false = non-active
//                         count: { $sum: 1 }
//                     }
//                 }
//             ]);

//             let total = 0;
//             let active = 0;
//             let nonActive = 0;

//             result.forEach(item => {
//                 total += item.count;
//                 if (item._id === true) active = item.count;
//                 else nonActive = item.count;
//             });

//             return { total, active, nonActive };
//         } catch (error) {
//             console.error('Error fetching downline counts:', error.message);
//             throw new Error(`Error fetching downline counts: ${error.message}`);
//         }
//     }

//     static async getAdminUserId() {
//         try {
//             const admin = await UserModel.findOne({ role: 'admin' }).select('userId');
//             return admin ? admin.userId : null;
//         } catch (error) {
//             console.error('Error finding admin userId:', error.message);
//             throw new Error(`Failed to find admin userId: ${error.message}`);
//         }
//     }

//     static async getTotalTeamByLevel(userId) {
//         try {
//             const user = await UserModel.findOne({ userId: userId });
//             if (!user) throw new Error("User not found");

//             const basePath = user.hierarchy || [];
//             const baseDepth = basePath.length;

//             const result = await UserModel.aggregate([
//                 {
//                     $match: {
//                         hierarchy: { $ne: null },
//                         hierarchy: { $elemMatch: { $eq: userId } }
//                     }
//                 },
//                 {
//                     $addFields: {
//                         level: {
//                             $subtract: [
//                                 { $size: "$hierarchy" },
//                                 baseDepth
//                             ]
//                         }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: { level: "$level", status: "$status" },
//                         count: { $sum: 1 }
//                     }
//                 }
//             ]);

//             const levelMap = {};

//             result.forEach(item => {
//                 const level = item._id.level;
//                 const status = item._id.status;

//                 if (!levelMap[level]) {
//                     levelMap[level] = {
//                         total: 0,
//                         active: 0,
//                         nonActive: 0
//                     };
//                 }

//                 levelMap[level].total += item.count;
//                 if (status === true) levelMap[level].active += item.count;
//                 else levelMap[level].nonActive += item.count;
//             });

//             // Convert to array of objects
//             const levelArray = Object.entries(levelMap).map(([level, data]) => ({
//                 level: parseInt(level),
//                 total: data.total,
//                 active: data.active,
//                 inActive: data.nonActive
//             }));

//             // Sort by level (optional)
//             levelArray.sort((a, b) => a.level - b.level);

//             return levelArray;
//         } catch (error) {
//             console.error('Error fetching downline counts:', error.message);
//             throw new Error(`Error fetching downline counts: ${error.message}`);
//         }
//     }
//   static async getUsersByLevel(level) {
//     try {
     
//       const users = await UserModel.find({ level });

//       if (!users || users.length === 0) {
//         return []; 
//       }

//       return users;
//     } catch (error) {
//       console.error("Error fetching users by level:", error.message);
//       throw new Error("Error fetching users by level");
//     }
//     static async getTotalCountUserDownlines(userId) {
//         try {
//           const result = await UserModel.aggregate([
//             {
//               $match: {
//                 hierarchy: userId, // should match _id of parent user
//               },
//             },
//             {
//               $group: {
//                 _id: "$status", // group by status
//                 count: { $sum: 1 },
//               },
//             },
//           ]);
      
//           let total = 0;
//           let active = 0;
//           let nonActive = 0;
      
//           result.forEach((item) => {
//             total += item.count;
//             if (item._id === true) active = item.count;
//             else nonActive = item.count;
//           });
      
//           return { total, active, nonActive };
//         } catch (error) {
//           console.error("Error fetching downline counts:", error.message);
//           throw new Error(`Error fetching downline counts: ${error.message}`);
//         }
//       }
      
// }


// export default userRepository;



import UserModel from "../../Models/UserModels.mjs";

class userRepository {
<<<<<<< HEAD

    // Get detailed user info
    static async getUserDetails(userId) {
        try {
            return await UserModel.findOne({ userId });
        } catch (error) {
            console.error("Error finding user by userId:", error.message);
            throw new Error(`Failed to find user by userId: ${error.message}`);
        }
=======
  static async getUserDetails(userId) {
    try {
      return await UserModel.findOne({ userId: userId });
    } catch (error) {
      console.error('Error finding user by userId:', error.message);
      throw new Error(`Failed to find user by userId: ${error.message}`);
>>>>>>> 0d8d5eb (TeamLevelReportController)
    }
  }

<<<<<<< HEAD
    // Get total count of direct downlines
    static async getTotalCountUserDownlines(userId) {
        try {
            const result = await UserModel.aggregate([
                { $match: { hierarchy: userId } },
                {
                    $group: {
                        _id: "$status",
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
=======
  static async getTotalCountUserDownlines(userId) {
    try {
      const result = await UserModel.aggregate([
        {
          $match: {
            hierarchy: userId // matching based on userId
          }
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
>>>>>>> 0d8d5eb (TeamLevelReportController)
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
 
  

<<<<<<< HEAD
<<<<<<< HEAD
    // Get admin's userId
=======
>>>>>>> 54bcf5d (level api)
    static async getAdminUserId() {
        try {
            const admin = await UserModel.findOne({ role: 'admin' }).select('userId');
            return admin ? admin.userId : null;
        } catch (error) {
            console.error('Error finding admin userId:', error.message);
            throw new Error(`Failed to find admin userId: ${error.message}`);
=======
  static async getAdminUserId() {
    try {
      const admin = await UserModel.findOne({ role: 'admin' }).select('userId');
      return admin ? admin.userId : null;
    } catch (error) {
      console.error('Error finding admin userId:', error.message);
      throw new Error(`Failed to find admin userId: ${error.message}`);
    }
  }

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
>>>>>>> 0d8d5eb (TeamLevelReportController)
        }
      ]);

<<<<<<< HEAD
<<<<<<< HEAD
    // Get total team by level for a user
    static async getTotalTeamByLevel(userId) {
        try {
            const user = await UserModel.findOne({ userId });
            if (!user) throw new Error("User not found");

            const basePath = user.hierarchy || [];
=======
    static async getTotalTeamByLevel(userId) {
        try {
            const user = await UserModel.findOne({ userId: userId });
            if (!user) throw new Error("User not found");

            const basePath = user.hierarchy || [];  // ensure it's an array
>>>>>>> 54bcf5d (level api)
            const baseDepth = basePath.length;

            const result = await UserModel.aggregate([
                {
                    $match: {
<<<<<<< HEAD
                        hierarchy: { $ne: null },
                        hierarchy: { $elemMatch: { $eq: userId } }
=======
                        hierarchy: { $ne: null },  // make sure it's present
                        hierarchy: { $elemMatch: { $eq: userId } }  // includes this user in hierarchy
>>>>>>> 54bcf5d (level api)
                    }
                },
                {
                    $addFields: {
                        level: {
<<<<<<< HEAD
                            $subtract: [{ $size: "$hierarchy" }, baseDepth]
=======
                            $subtract: [
                                { $size: "$hierarchy" },
                                baseDepth
                            ]
>>>>>>> 54bcf5d (level api)
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

<<<<<<< HEAD
            return Object.entries(levelMap).map(([level, data]) => ({
=======
            // Convert to array of objects
            const levelArray = Object.entries(levelMap).map(([level, data]) => ({
>>>>>>> 54bcf5d (level api)
                level: parseInt(level),
                total: data.total,
                active: data.active,
                inActive: data.nonActive
<<<<<<< HEAD
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
            return users || [];
        } catch (error) {
            console.error("Error fetching users by level:", error.message);
            throw new Error("Error fetching users by level");
        }
    }

    // ✅ Get downline users and include required fields
    static async getUserDownlines(userId, hierarchy) {
        try {
            return await UserModel.find({
                hierarchy: userId
            }).select(
                "fullName userId level state referredBy dob phone whatsapp email status createdAt"
            );
        } catch (error) {
            console.error("Error fetching downline:", error.message);
            throw new Error(`Error fetching downline: ${error.message}`);
        }
    }

    // Optional: Get users with referrer name (if needed in a separate place)
    static async getUsersWithReferrerName(level) {
        try {
            const users = await UserModel.find({ level });

            if (!users || users.length === 0) {
                return [];
            }

            return await Promise.all(
                users.map(async (user) => {
                    const referrer = user.referredBy
                        ? await this.findUserByUserId(user.referredBy)
                        : null;
                    const referrerName = referrer ? referrer.fullName : "Unknown";

                    return {
                        fullName: user.fullName,
                        userId: user.userId,
                        state: user.state,
                        level: user.level,
                        referredBy: referrerName,
                        dob: user.dob,
                        phone: user.phone,
                        whatsapp: user.whatsapp,
                        email: user.email,
                        status: user.status ? "Active" : "Inactive",
                    };
                })
            );
        } catch (error) {
            console.error("Error fetching users with referrer name:", error.message);
            throw new Error("Error fetching users with referrer name");
=======
            }));

            // Sort by level (optional)
            levelArray.sort((a, b) => a.level - b.level);

            return levelArray;
        } catch (error) {
            console.error('Error fetching downline counts:', error.message);
            throw new Error(`Error fetching downline counts: ${error.message}`);
>>>>>>> 54bcf5d (level api)
=======
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
>>>>>>> 0d8d5eb (TeamLevelReportController)
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
    // Get user by userId
  static async findUserByUserId(userId) {
    try {
      return await UserModel.findOne({ userId: userId });
    } catch (error) {
      throw new Error("Error fetching user from the database");
    }
  }
}

export default userRepository;