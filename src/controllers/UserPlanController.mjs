// import userPlanRepository from '../Repositories/UserPlanRepositories.mjs';  

// class UserPlanController {
//   // Create a new user plan
//   async create(req, res) {
//     try {
//       // Assuming you pass `expireAt` manually when creating
//       const userPlan = await userPlanRepository.createUserPlan(req.body);
//       res.status(201).json({ message: 'User plan created successfully', userPlan });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }

//   // Get all user plans
//   async getAll(req, res) {
//     try {
//       const userPlans = await userPlanRepository.getAllUserPlans();
//       res.status(200).json({ message: 'User plans retrieved successfully', userPlans });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // Get a user plan by userId
//   async getById(req, res) {
//     try {
//       const userPlan = await userPlanRepository.getUserPlanById(req.params.userId);
//       res.status(200).json({ message: 'User plan retrieved successfully', userPlan });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // Update a user plan by userId
//   async update(req, res) {
//     try {
//       const updatedUserPlan = await userPlanRepository.updateUserPlan(req.params.userId, req.body);
//       res.status(200).json({ message: 'User plan updated successfully', updatedUserPlan });
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }

//   // Delete a user plan by userId
//   async delete(req, res) {
//     try {
//       const deletedUserPlan = await userPlanRepository.deleteUserPlan(req.params.userId);
//       res.status(200).json({ message: 'User plan deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// export default new UserPlanController();









// import userPlanRepository from '../Repositories/UserPlanRepositories.mjs';  

// class UserPlanController {
//   // Create a new user plan
// //   async create(req, res) {
// //     try {
// //       const { userId, planId, expireAt } = req.body;
// //       const expireDate = expireAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  

// //       const newUserPlan = {
// //         userId,
// //         planId,
// //         expireAt: expireDate, 
// //       };
// //       const userPlan = await userPlanRepository.createUserPlan(newUserPlan);
// //       res.status(201).json({ message: 'User plan created successfully', userPlan });
// //     } catch (error) {
// //       res.status(400).json({ message: 'Error creating user plan', error: error.message });
// //     }
// //   }






// async create(req, res) {
//     try {
//       const { userId, planId, expireAt } = req.body;
      
//       // Fetch the plan based on planId
//       const plan = await planRepository.getPlanById(planId);
  
//       if (!plan) {
//         return res.status(404).json({ message: 'Plan not found' });
//       }
  
//       // Calculate expireAt based on plan's days and current date
//       const calculatedExpireDate = expireAt || new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000);
  
//       const newUserPlan = {
//         userId,
//         planId,
//         expireAt: calculatedExpireDate,  // Use the calculated expiration date
//       };
  
//       // Save to the database
//       const userPlan = await userPlanRepository.createUserPlan(newUserPlan);
//       res.status(201).json({ message: 'User plan created successfully', userPlan });
//     } catch (error) {
//       res.status(400).json({ message: 'Error creating user plan', error: error.message });
//     }
//   }
  

//   // Get all user plans
//   async getAll(req, res) {
//     try {
//       const userPlans = await userPlanRepository.getAllUserPlans();
//       if (!userPlans || userPlans.length === 0) {
//         return res.status(404).json({ message: 'No user plans found' });
//       }
//       res.status(200).json({ message: 'User plans retrieved successfully', userPlans });
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving user plans', error: error.message });
//     }
//   }

//   // Get a user plan by userId
//   async getById(req, res) {
//     try {
//       const userPlan = await userPlanRepository.getUserPlanById(req.params.userId);
//       if (!userPlan) {
//         return res.status(404).json({ message: 'User plan not found' });
//       }
//       res.status(200).json({ message: 'User plan retrieved successfully', userPlan });
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving user plan', error: error.message });
//     }
//   }

//   // Update a user plan by userId
//   async update(req, res) {
//     try {
//       const updatedUserPlan = await userPlanRepository.updateUserPlan(req.params.userId, req.body);
//       if (!updatedUserPlan) {
//         return res.status(404).json({ message: 'User plan not found' });
//       }
//       res.status(200).json({ message: 'User plan updated successfully', updatedUserPlan });
//     } catch (error) {
//       res.status(400).json({ message: 'Error updating user plan', error: error.message });
//     }
//   }

//   // Delete a user plan by userId
//   async delete(req, res) {
//     try {
//       const deletedUserPlan = await userPlanRepository.deleteUserPlan(req.params.userId);
//       if (!deletedUserPlan) {
//         return res.status(404).json({ message: 'User plan not found' });
//       }
//       res.status(200).json({ message: 'User plan deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error deleting user plan', error: error.message });
//     }
//   }
// }

// export default new UserPlanController();




import planRepository from '../Repositories/PlanRepositories.mjs';  
import userPlanRepository from '../Repositories/UserPlanRepositories.mjs'; 
import UserRepository from '../Repositories/UserRepository.mjs'; 

class UserPlanController {
  // Create a new user plan
  async create(req, res) {
    try {
      const { userId, planId, expireAt } = req.body;

      // Fetch the plan based on planId
      const plan = await planRepository.getPlanById(planId);

      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }

      // Calculate expireAt based on plan's days and current date
      const calculatedExpireDate = expireAt || new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000);

      const newUserPlan = {
        userId,
        planId,
        expireAt: calculatedExpireDate,  // Use the calculated expiration date
      };

      // Save to the database
      const userPlan = await userPlanRepository.createUserPlan(newUserPlan);
      res.status(201).json({ message: 'User plan created successfully', userPlan });
    } catch (error) {
      res.status(400).json({ message: 'Error creating user plan', error: error.message });
    }
  }

  // Get all user plans
  async getAll(req, res) {
    try {
      const userPlans = await userPlanRepository.getAllUserPlans();
      if (!userPlans || userPlans.length === 0) {
        return res.status(404).json({ message: 'No user plans found' });
      }
      res.status(200).json({ message: 'User plans retrieved successfully', userPlans });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user plans', error: error.message });
    }
  }

  // Get a user plan by userId
  async getById(req, res) {
    try {
      const userPlan = await userPlanRepository.getUserPlanById(req.params.userId);
      if (!userPlan) {
        return res.status(404).json({ message: 'User plan not found' });
      }
      res.status(200).json({ message: 'User plan retrieved successfully', userPlan });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user plan', error: error.message });
    }
  }

  // Update a user plan by userId
  async update(req, res) {
    try {
      const updatedUserPlan = await userPlanRepository.updateUserPlan(req.params.userId, req.body);
      if (!updatedUserPlan) {
        return res.status(404).json({ message: 'User plan not found' });
      }
      res.status(200).json({ message: 'User plan updated successfully', updatedUserPlan });
    } catch (error) {
      res.status(400).json({ message: 'Error updating user plan', error: error.message });
    }
  }

  // Delete a user plan by userId
  async delete(req, res) {
    try {
      const deletedUserPlan = await userPlanRepository.deleteUserPlan(req.params.userId);
      if (!deletedUserPlan) {
        return res.status(404).json({ message: 'User plan not found' });
      }
      res.status(200).json({ message: 'User plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user plan', error: error.message });
    }
  }
}

export default new UserPlanController();
