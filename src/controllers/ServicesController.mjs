import serviceRepo from '../Repositories/ServicesRepositories.mjs';

class ServiceController {
  async getAll(req, res) {
    try {
      const services = await serviceRepo.getAll();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving services', error });
    }
  }

  async getById(req, res) {
    try {
      const service = await serviceRepo.getById(req.params.id);
      if (!service) return res.status(404).json({ message: 'Service not found' });
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving service by ID', error });
    }
  }

  async create(req, res) {
    try {
      const service = req.body;
      // Check if the service name is one of the allowed types (validation)
      const allowedServices = [
        'Mobile Recharge', 'DTH', 'Fastag', 'Electricity Bill', 'Gas Piped Bill',
        'Water Bill', 'Loan & EMI', 'LIC/Insurance', 'Broadband'
      ];
      if (!allowedServices.includes(service.type)) {
        return res.status(400).json({ message: 'Invalid service type' });
      }
      const newService = await serviceRepo.create(service);
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ message: 'Error creating service', error });
    }
  }

  async update(req, res) {
    try {
      const updated = await serviceRepo.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Service not found' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Error updating service', error });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await serviceRepo.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Service not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting service', error });
    }
  }
}

export default new ServiceController();
