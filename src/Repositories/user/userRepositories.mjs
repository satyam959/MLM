import UserModel from "../../Models/UserModels.mjs";

class userRepository {

    static async getUserDetails(userId) {
        try {
            return await UserModel.findOne({ userId: userId }); // assuming userId is a custom field
        } catch (error) {
            console.error('Error finding user by userId:', error.message);
            throw new Error(`Failed to find user by userId: ${error.message}`);
        }
    }

    static async getTotalCountUserDownlines(userId) {
        try {
            const result = await UserModel.aggregate([
                { $match: { hierarchy: userId } },
                {
                    $group: {
                        _id: '$status', // true = active, false = non-active
                        count: { $sum: 1 }
                    }
                }
            ]);

            let total = 0;
            let active = 0;
            let nonActive = 0;

            result.forEach(item => {
                total += item.count;
                if (item._id === true) active = item.count;
                else nonActive = item.count;
            });

            return { total, active, nonActive };
        } catch (error) {
            console.error('Error fetching downline counts:', error.message);
            throw new Error(`Error fetching downline counts: ${error.message}`);
        }
    }

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

            // Convert to array of objects
            const levelArray = Object.entries(levelMap).map(([level, data]) => ({
                level: parseInt(level),
                total: data.total,
                active: data.active,
                inActive: data.nonActive
            }));

            // Sort by level (optional)
            levelArray.sort((a, b) => a.level - b.level);

            return levelArray;
        } catch (error) {
            console.error('Error fetching downline counts:', error.message);
            throw new Error(`Error fetching downline counts: ${error.message}`);
        }
    }
}

export default userRepository;
