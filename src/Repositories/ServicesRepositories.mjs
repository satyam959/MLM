import Service from '../Models/ServicesModel.mjs';

class ServicesRepositories {

// Create a new service
async create(serviceData) {
    const newService = new Service(serviceData);
    return await newService.save(); // Saves the new service to the database
  }

  // Get all services
  async getAll() {
    return await Service.find(); // Retrieves all services from the database
  }

  // Get a service by ID
  async getById(id) {
    return await Service.findById(id); // Retrieves a service by its unique ID
  }

  

  // Update a service
  async update(id, serviceData) {
    return await Service.findByIdAndUpdate(id, serviceData, { new: true }); // Updates the service and returns the updated document
  }

  // Delete a service
  async delete(id) {
    return await Service.findByIdAndDelete(id); // Deletes the service by its ID
  }
}

export default new ServicesRepositories();
