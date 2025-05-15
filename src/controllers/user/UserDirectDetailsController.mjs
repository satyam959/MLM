import UserRepository from "../../Repositories/user/userRepositories.mjs";

class UserDirectDetailsController {

    static async getUserReferalMember(req, res) {
        try {
            const { userId } = req.user;
            const { status, name, phone, fromDate, toDate } = req.query;

            // Prepare filters object
            const filters = {
                referredBy: userId, // base filter
            };

            if (status?.toLowerCase() === "active") {
                filters.status = true;
            }
            if (status?.toLowerCase() === "inactive") {
                filters.status = false;
            }

            if (name) {
                filters.fullName = { $regex: name, $options: "i" };
            }

            if (phone) {
                filters.phone = { $regex: phone, $options: "i" };
            }

            if (fromDate && toDate) {
                filters.createdAt = {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate),
                };
            }

            // Pass filters to repository
            const referalUser = await UserRepository.getReferalUser(filters);

            return res.status(200).json({
                success: true,
                statusCode: 200,
                message: "User referal detail retrieved successfully",
                data: { referalUser },
            });
        } catch (error) {
            console.error("Error fetching user referal:", error);
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
