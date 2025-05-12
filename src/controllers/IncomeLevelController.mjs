import IncomeLevelRepository from '../Repositories/IncomeLevelRepositories.mjs';
import UserRepository from "../Repositories/UserRepository.mjs";
import ServiceRepository from '../Repositories/ServicesRepositories.mjs';
class IncomeLevelController {
    // Create new income level
    async create(req, res) {
        try {
          if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
          }
      
          const { userId } = req.user;
      

          let { income, team, level } = req.body;
      

          income = Number(income);
          team = Number(team);
          level = Number(level);
      

          if (isNaN(income) || isNaN(team) || isNaN(level)) {
            return res.status(400).json({ message: 'income, team, and level must be valid numbers' });
          }
      
          const total = income * team;
      
          const newIncomeLevel = await IncomeLevelRepository.create({ userId, income, team, total, level });
      
          res.status(201).json({
            message: 'Income Level created successfully',
            data: newIncomeLevel
          });
        } catch (error) {
          console.error('Error creating income level:', error);
          res.status(500).json({ message: 'Error creating income level', error: error.message });
        }
      }
   // Get all income levels
  async getAllIncome(req, res) {
    const { userId } = req.user;
    try {
      const user = await UserRepository.findUserByUserId(userId);
      const services = await ServiceRepository.find();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const {
        userId: uId,
        fullName,
        phone,
        email,
        companyName,
        address,
        city,
        state,
        country,
        pinCode,
        image,
        referralCode,
      } = user;

      const banner = [];

      const companyProfile = {
        companyName: companyName || "Scriza",
        companyContact: phone || "N/A",
        companyEmail: email || "support@scriza.in",
        companyWebsite: "https://yourcompanywebsite.com"
      };

      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "User profile fetched successfully",
        user: {
          userId: uId,
          fullName,
          phone,
          email,
          companyName,
          address,
          city,
          state,
          country,
          pinCode,
          image,
          referralCode,
        },
        services,
        banner,
        companyProfile
      });

    } catch (error) {
      return res.status(500).json({
        message: "Error fetching user profile",
        error: error.message,
      });
    }
  }



    // // Get income level by ID
    // async getById(req, res) {
    //     try {
    //         const level = await IncomeLevelRepository.findById(req.params.id);
    //         if (!level) return res.status(404).json({ message: 'Income Level not found' });
    //         res.json({ message: 'Income Level fetched successfully', data: level });
    //     } catch (error) {
    //         console.error('Error fetching income level:', error);
    //         res.status(500).json({ message: 'Error fetching income level', error: error.message });
    //     }
    // }

    // Update income level by ID
    async update(req, res) {
        try {
            const { income, team, status, level } = req.body;
            const { incomeId} = req.params;

            // Ensure all required fields are provided
            if (!income || !team || !status || level === undefined || level === null) {
                return res.status(400).json({ message: 'Income, team, status, and level are required fields' });
            }

            const total = income * team;

            const updatedIncomeLevel = await IncomeLevelRepository.update(incomeId, { income, team, status, total, level });

            if (!updatedIncomeLevel) return res.status(404).json({ message: 'Income Level not found' });

            res.json({ message: 'Income Level updated successfully', data: updatedIncomeLevel });
        } catch (error) {
            console.error('Error updating income level:', error);
            res.status(500).json({ message: 'Error updating income level', error: error.message });
        }
    }

    // Delete income level by ID
    async delete(req, res) {
        try {
            const deletedIncomeLevel = await IncomeLevelRepository.delete(req.params.incomeId);
            if (!deletedIncomeLevel) return res.status(404).json({ message: 'Income Level not found' });
            res.json({ message: 'Income Level deleted successfully' });
        } catch (error) {
            console.error('Error deleting income level:', error);
            res.status(500).json({ message: 'Error deleting income level', error: error.message });
        }
    }
}

export default new IncomeLevelController();
