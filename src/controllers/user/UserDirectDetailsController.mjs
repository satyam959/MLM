import UserRepository from "../../Repositories/user/userRepositories.mjs";

class UserDirectDetailsController {
    static async getUserReferalMember(req, res) {
        try {
            const { userId } = req.user;
            const userData = await UserRepository.getUserDetails(userId);

            const referalUser = await UserRepository.getReferalUser(userId);

            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "User referal detail retrieved successfully",
                data: {
                    referalUser
                },
            });
        } catch (error) {
            console.error("Error fetching user level report:", error);
            return res.status(500).json({
                success: false,
                statusCode: 500,
                message: "Error fetching user referal",
                error: error.message,
            });
        }
    }
}

export default UserDirectDetailsController;
