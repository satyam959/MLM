import RankRoyalty from "../Models/RankRoyaltyHistoriesModel.mjs";
import Rank from "../Models/RankModels.mjs";
import moment from "moment"; // Install if not already: npm i moment


class RankRoyaltyRepository {


  // ✅ Get all Rank Royalty entries with rank details
  static async getAllWithRankDetails() {
    const royaltyHistories = await RankRoyalty.find().lean();
    const ranks = await Rank.find().lean();
  
    const joined = royaltyHistories.map(history => {
      const matchedRank = ranks.find(rank => rank.rankId === history.rankId);
      return {
        // _id: history._id,
        rankName: matchedRank?.name || "Unknown",
        totalUsers: history.totalUsers,
        totalAmountPaid: history.totalAmountPaid,
        perUserAmount: history.perUserAmount,
        datetime: moment(history.createdAt).format("YYYY-MM-DD, hh:mm:ss A"),
      };
    });
  
    return joined;
  }
    
  }



export default RankRoyaltyRepository;
