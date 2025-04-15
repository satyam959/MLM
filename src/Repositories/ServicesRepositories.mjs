import Service from '../Models/ServicesModel.mjs';  // Importing the Service model

class ServiceRepository {

  // Method to create a new Service
  async create(serviceData) {
    try {
      const service = new Service(serviceData);
      await service.save();
      return service;
    } catch (error) {
      throw new Error('Error creating service');
    }
  }

  // Method to fetch all services
  async getAll() {
    try {
      return await Service.find();
    } catch (error) {
      throw new Error('Error fetching services');
    }
  }

  // Method to get a service by ID
  async getById(serviceId) {
    try {
      return await Service.findById(serviceId);
    } catch (error) {
      throw new Error('Error fetching service');
    }
  }

  // Method to update a service by ID
  async update(serviceId, updatedData) {
    try {
      return await Service.findByIdAndUpdate(serviceId, updatedData, { new: true });
    } catch (error) {
      throw new Error('Error updating service');
    }
  }

  // Method to delete a service by ID
  async delete(serviceId) {
    try {
      return await Service.findByIdAndDelete(serviceId);
    } catch (error) {
      throw new Error('Error deleting service');
    }
  }
}

export default new ServiceRepository();
