import UserRepository from '../../Repositories/user/userRepositories.mjs';
import UserWalletRepository from '../../Repositories/user/userWalletRepositories.mjs';

class PortfolioController {

    static async getUserPortfolio(req, res) {
        try {

            const userTokenData = req.user;
            const userDetails = await UserRepository.getUserDetails(userTokenData.userId);
            const walletBalance = await UserWalletRepository.findWalletByUserId(userTokenData.userId);

            const teamCount = await UserRepository.getTotalCountUserDownlines(userTokenData.userId);
            return res.status(200).json({
                status: true,
                statusCode: 200,
                message: 'User portfolio retrieved successfully',
                data: {
                    user: {
                        userImage: userDetails.image,
                        name: userDetails.fullName,
                        email: userDetails.email,
                        rank: userDetails.rank,
                        totalEarning: walletBalance?.balance ?? 0,
                        isPrime: userDetails.membership  
                    },
                    royaltyIncome: {
                        balance: 0
                    },
                    team: {
                        total: teamCount.total,
                        active: teamCount.active,
                        inActive: teamCount.nonActive
                    }
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user portfolio', error: error.message });
        }
    }
}


export default PortfolioController;
