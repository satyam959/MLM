import Service from '../Models/ServicesModel.mjs';  // Importing the Service model

class ServiceController {
  
  // Create a new Service
  async createService(req, res) {
    try {
      const { serviceType } = req.body;
      
      const service = new Service({ serviceType });
      await service.save();

      return res.status(201).json({ message: 'Service created successfully', service });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating service', error });
    }
  }

  // Get all services
  async getAllServices(req, res) {
    try {
      const services = await Service.find();
      return res.status(200).json({ services });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching services', error });
    }
  }

  // Get a specific service by its ID
  async getServiceById(req, res) {
    const { id } = req.params;
    
    try {
      const service = await Service.findById(id);

      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      return res.status(200).json({ service });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching service', error });
    }
  }

  // Update a specific service by its ID
  async updateService(req, res) {
    const { id } = req.params;
    const { serviceType, status } = req.body;

    try {
      const updatedService = await Service.findByIdAndUpdate(id, { serviceType, status }, { new: true });

      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found' });
      }

      return res.status(200).json({ message: 'Service updated successfully', updatedService });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating service', error });
    }
  }

  // Delete a service
  async deleteService(req, res) {
    const { id } = req.params;
    
    try {
      const deletedService = await Service.findByIdAndDelete(id);

      if (!deletedService) {
        return res.status(404).json({ message: 'Service not found' });
      }

      return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting service', error });
    }
  }
}

export default new ServiceController();
