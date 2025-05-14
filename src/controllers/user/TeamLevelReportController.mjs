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


export default TeamLevelReportController;
