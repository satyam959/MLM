import Plan from '../Models/PlanModel.mjs'; 

class PlanRepository {
  // Create a new plan
  async createPlan(planData) {
    try {
      const plan = new Plan(planData);
      await plan.save();
      return plan;
    } catch (error) {
      throw new Error(`Error creating plan: ${error.message}`);
    }
  }

  // Get all plans
  async getAllPlans() {
    try {
      return await Plan.find();
    } catch (error) {
      throw new Error(`Error fetching plans: ${error.message}`);
    }
  }

  // Get a plan by its planId (not by _id)
  async getPlanById(planId) {
    try {
      // Use the planId field (not the default _id field)
      return await Plan.findOne({ planId });
    } catch (error) {
      throw new Error('Error fetching plan by ID: ' + error.message);
    }
  }


  // Update a plan by ID
  async updatePlanById(planId, updatedData) {
    try {
      const plan = await Plan.findByIdAndUpdate(planId, updatedData, { new: true, runValidators: true });
      return plan;
    } catch (error) {
      throw new Error(`Error updating plan: ${error.message}`);
    }
  }

  // Delete a plan by ID
  async deletePlanById(planId) {
    try {
      const plan = await Plan.findByIdAndDelete(planId);
      return plan;
    } catch (error) {
      throw new Error(`Error deleting plan: ${error.message}`);
    }
  }
}

export default new PlanRepository();
