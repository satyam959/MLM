
import ServiceRepository from '../Repositories/ServicesRepositories.mjs';
import UserRepository from "../Repositories/UserRepository.mjs";

class HomeDashboardController{


 async getAll(req, res) {
    const { userId } = req.user;   
    try {
      const user = await UserRepository.findUserByUserId(userId);  
      const services = await ServiceRepository.find();
      const banner = [];
      const companyProfile = [];
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
        companyProfile,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching user profile",
        error: error.message,
      });
    }
  }
  

}
export default new HomeDashboardController();