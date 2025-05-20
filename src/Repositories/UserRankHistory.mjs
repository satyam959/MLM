import RankHistory from '../Models/RankHistoryModel.mjs';

class UserRankRepository {
    static async createUserRankHistory(data) {
        try {
            const userRankHistory = new RankHistory(data);
            await userRankHistory.save();
            return userRankHistory;
        } catch (error) {
            console.error('Error creating rank history:', error);
            throw new Error('Error creating rank history: ' + error.message);
        }
    }
}

export default UserRankRepository;
