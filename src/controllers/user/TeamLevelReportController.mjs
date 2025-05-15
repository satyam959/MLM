<<<<<<< HEAD
import UserRepository from "../../Repositories/user/userRepositories.mjs";

class TeamLevelReportController {
    static async getUserTeamLevelReport(req, res) {
        try {
          const { userId } = req.user;
      
          // Fetch total downline team counts
          const teamCount = await UserRepository.getTotalCountUserDownlines(userId);
      
          // Fetch total team members by level
          const level = await UserRepository.getTotalTeamByLevel(userId);
      
          return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "User level report retrieved successfully",
            data: {
              level,
              team: {
                total: teamCount.total,
                active: teamCount.active,
                inActive: teamCount.nonActive,
              },
            },
          });
        } catch (error) {
          console.error("Error fetching user level report:", error);
          return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Error fetching user level report",
            error: error.message,
          });
        }
      }
      static async getUsersByLevel(req, res) {
        try {
          const { level } = req.params;
          const numericLevel = Number(level);
      
          if (isNaN(numericLevel)) {
            return res.status(400).json({
              success: false,
              statusCode: 400,
              message: "Level must be a valid number",
            });
          }
      
          const { fullName, userId, status } = req.query;
          const currentUserId = req.user.userId;
      
          const userData = await UserRepository.getUserDetails(currentUserId);
          const hierarchy = Array.isArray(userData.hierarchy) ? userData.hierarchy : [];
      
          const downlineUsers = await UserRepository.getUserDownlines(currentUserId, hierarchy);
          const levelUsers = downlineUsers.filter(user => user.level === numericLevel);
      
          const formattedUsers = await Promise.all(
            levelUsers.map(async (user) => {
              const teamCount = await UserRepository.getTotalCountUserDownlines(user.userId);
      
              let referrerName = "Unknown";
              if (user.referredBy) {
                const referrer = await UserRepository.getUserDetails(user.referredBy);
                if (referrer) {
                  referrerName = referrer.fullName || referrer.name || "Unknown";
                }
              }
      
              return {
                fullName: user.fullName,
                userId: user.userId,
                state: user.state,
                level: user.level,
                dob: user.dob,
                phone: user.phone,
                whatsapp: user.whatsapp,
                email: user.email,
                referredBy: referrerName,
                totalTeam: {
                  active: teamCount.active,
                  inActive: teamCount.nonActive,
                },
                status: user.status ? "Active" : "Inactive",
              };
            })
          );
      
          // ✅ Apply search filters
          let filteredUsers = formattedUsers;
      
          if (fullName) {
            const searchName = fullName.toLowerCase();
            filteredUsers = filteredUsers.filter(user =>
              user.fullName?.toLowerCase().includes(searchName)
            );
          }
      
          if (userId) {
            filteredUsers = filteredUsers.filter(user =>
              user.userId.toString() === userId.toString()
            );
          }
      
          if (status) {
            const statusLower = status.toLowerCase();
            filteredUsers = filteredUsers.filter(user =>
              user.status.toLowerCase() === statusLower
            );
          }
      
          return res.status(200).json({
            success: true,
            statusCode: 200,
            message: filteredUsers.length > 0
              ? `Users at level ${numericLevel} fetched successfully`
              : `No users found at level ${numericLevel} matching criteria`,
            totalMember: filteredUsers.length,
            data: filteredUsers,
          });
        } catch (error) {
          console.error("Error fetching users by level:", error);
          return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Server error while fetching users by level",
            error: error.message,
          });
        }
      }
      
      
      
}

=======
import UserRepository from '../../Repositories/user/userRepositories.mjs';

class TeamLevelReportController {

    static async getUserTeamLevelReport(req, res) {
        try {

            const userTokenData = req.user;

            const teamCount = await UserRepository.getTotalCountUserDownlines(userTokenData.userId);
            const level = await UserRepository.getTotalTeamByLevel(userTokenData.userId);
            return res.status(200).json({
                status: true,
                statusCode: 200,
                message: 'User level retrieved successfully',
                data: {
                    level,
                    team: {
                        total: teamCount.total,
                        active: teamCount.active,
                        inActive: teamCount.nonActive
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user level report', error: error.message });
        }
    }
}


>>>>>>> 54bcf5d (level api)
export default TeamLevelReportController;
