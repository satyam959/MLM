import UserRepository from "../../Repositories/user/userRepositories.mjs";

class TeamLevelReportController {
  static async getUserTeamLevelReport(req, res) {
    try {
      const userTokenData = req.user;
      const teamCount = await UserRepository.getTotalCountUserDownlines(
        userTokenData.userId
      );
      const level = await UserRepository.getTotalTeamByLevel(
        userTokenData.userId
      );
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "User level retrieved successfully",
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
      res
        .status(500)
        .json({
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

        const userId = req.user.userId;

        // Get current user and hierarchy (if needed)
        const userData = await UserRepository.findUserByUserId(userId);
        const hierarchy = Array.isArray(userData.hierarchy) ? userData.hierarchy : [];

        // Only get downline of the logged-in user
        const downlineUsers = await UserRepository.getUserDownlines(userId, hierarchy);

        // Filter users by level within the downline
        const levelUsers = downlineUsers.filter(user => user.level === numericLevel);

        const formattedUsers = await Promise.all(
            levelUsers.map(async (user) => {
                const teamCount = await UserRepository.getTotalCountUserDownlines(user.userId);
                let referrerName = "Unknown";

                // Check if the referredBy field is set correctly
                if (user.referredBy) {
                    console.log(`Fetching referrer for user: ${user.userId}, referred by: ${user.referredBy}`);

                    // Fetch the user who referred the current user
                    const referrer = await UserRepository.findUserByUserId(user.referredBy);
                    if (referrer) {
                        referrerName = referrer.fullName || referrer.name || "Unknown";
                    } else {
                        console.log(`No referrer found for user: ${user.userId}`);
                    }
                } else {
                    console.log(`No referredBy data for user: ${user.userId}`);
                }

                return {
                    fullName: user.fullName,
                    userId: user.userId,
                    state: user.state,
                    level: user.level,
                    referredBy: referrerName,  
                    totalTeam: {
                        active: teamCount.active,
                        inActive: teamCount.nonActive,
                    },
                    status: user.status ? "Active" : "Inactive",
                };
            })
        );

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message:
                formattedUsers.length > 0
                    ? `Users at level ${numericLevel} fetched successfully`
                    : `No users found at level ${numericLevel} under your downline`,
            totalMember: formattedUsers.length,
            data: formattedUsers,
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

export default TeamLevelReportController;
