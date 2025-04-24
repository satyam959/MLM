import planRepository from '../Repositories/PlanRepositories.mjs';  

class PlanController {
  // Create a new plan
  async create(req, res) {
    try {
      const plan = await planRepository.createPlan(req.body);  
      res.status(201).json({ message: 'Plan created successfully', plan });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all plans
  async getAll(req, res) {
    try {
      const plans = await planRepository.getAllPlans();  
      res.status(200).json({ message: 'Plans retrieved successfully', plans });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a plan by ID
  async getById(req, res) {
    try {
      const plan = await planRepository.getPlanById(req.params.planId);  
      if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      res.status(200).json({ message: 'Plan retrieved successfully', plan });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update a plan
  async update(req, res) {
    try {
      const updatedPlan = await planRepository.updatePlanById(req.params.planId, req.body); 
      if (!updatedPlan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      res.status(200).json({ message: 'Plan updated successfully', updatedPlan });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a plan
  async delete(req, res) {
    try {
      const deletedPlan = await planRepository.deletePlanById(req.params.planId);  
      if (!deletedPlan) {
        return res.status(404).json({ message: 'Plan not found' });
      }
      res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PlanController();
