import UserRepository from "../../Repositories/user/userRepositories.mjs";

<<<<<<< HEAD
class UserTeamDownline {
  async getUserDownline(req, res) {
=======

class UserTeamDownline{

async getUserDownline(req, res) {
>>>>>>> 0d8d5eb (TeamLevelReportController)
    try {
      const userId = req.user.userId;
      const { startDate, endDate, search } = req.query;

<<<<<<< HEAD
      const userData = await UserRepository.getUserDetails(userId);
=======
      const userData = await UserRepository.findUserByUserId(userId);
>>>>>>> 0d8d5eb (TeamLevelReportController)
      const hierarchy = Array.isArray(userData.hierarchy)
        ? userData.hierarchy
        : [];

      let downline = await UserRepository.getUserDownlines(userId, hierarchy);

<<<<<<< HEAD
      // Filter by date range
=======
>>>>>>> 0d8d5eb (TeamLevelReportController)
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

<<<<<<< HEAD
      // Filter by search
=======
>>>>>>> 0d8d5eb (TeamLevelReportController)
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

<<<<<<< HEAD
      // Format result with referrer name
      const formatted = await Promise.all(
        downline.map(async (user) => {
          let referrerName = null;

          if (user.referredBy) {
            const referrer = await UserRepository.getUserDetails(
              user.referredBy
            );
            if (referrer) {
              referrerName = referrer.fullName || referrer.name || null;
            }
          }

          return {
            fullName: user.fullName,
            userId: user.userId,
            level: user.level,
            state: user.state,
            referredBy: referrerName,
            dob: user.dob,
            phone: user.phone,
            whatsapp: user.whatsapp,
            email: user.email,
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
          };
        })
      );

      return res.status(200).json({
        statusCode: 200,
        message:
          formatted.length > 0
            ? "Downline retrieved successfully"
            : "No Downline found",
        totalMember: formatted.length,
        data: formatted,
      });
=======
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
>>>>>>> 0d8d5eb (TeamLevelReportController)
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

<<<<<<< HEAD
export default new UserTeamDownline();
=======

export default new UserTeamDownline()
>>>>>>> 0d8d5eb (TeamLevelReportController)
