import User from "../../Models/UserModels.mjs";

class TeamRepository {
  async getTeamCount(userId) {
    const teamMembers = await User.find({ referrerId: userId }); 

    const total = teamMembers.length;
    const active = teamMembers.filter(m => m.status === "active").length;
    const nonActive = total - active;

    return { total, active, nonActive };
  }
}

export default new TeamRepository();
