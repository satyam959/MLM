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
    static async getUserRankHistory(userId) {
        try {
          const history = await RankHistory.aggregate([
            { $match: { userId: userId } },
            {
              $lookup: {
                from: 'ranks',         // Rank collection name
                localField: 'rankId',
                foreignField: 'rankId',
                as: 'rankDetails'
              }
            },
            {
              $unwind: {
                path: '$rankDetails',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                _id: 0,  // <-- exclude _id here
                userId: 1,
                rankName: { $ifNull: ['$rankDetails.name', 'Unknown'] },
                createdAt: '$adt',
                updatedAt: '$utd'
              }
            },
            { $sort: { createdAt: -1 } }
          ]);
      
          return history;
        } catch (error) {
          console.error("Error fetching rank history:", error);
          throw new Error("Could not fetch rank history");
        }
      }
      
      
    }
    

export default UserRankRepository;
