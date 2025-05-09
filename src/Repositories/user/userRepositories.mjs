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

}

export default userRepository;
