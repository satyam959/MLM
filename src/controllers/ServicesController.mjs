// // import ServiceRepository from '../Repositories/ServicesRepositories.mjs';  // Importing the Service model

// // class ServiceController {
  
// //   // Create a new Service
// //   async createService(req, res) {
// //     try {
// //       // const { serviceType } = req.body;
// //       const newService = await ServiceRepository.create(req.body);
// //       return res.status(201).json({ message: 'Service created successfully', newService });
// //     } catch (error) {
// //       return res.status(500).json({ message: 'Error creating service', error });
// //     }
// //   }

// //   // Get all services
// //   async getAllServices(req, res) {
// //     try {
// //       const services = await ServiceRepository.find();
// //       return res.status(200).json({ services });
// //     } catch (error) {
// //       return res.status(500).json({ message: 'Error fetching services', error });
// //     }
// //   }

// //   // Get a specific service by its ID
// //   async getServiceById(req, res) {
// //     const { id } = req.params;
    
// //     try {
// //       const service = await ServiceRepository.findById(id);

// //       if (!service) {
// //         return res.status(404).json({ message: 'Service not found' });
// //       }

// //       return res.status(200).json({ service });
// //     } catch (error) {
// //       return res.status(500).json({ message: 'Error fetching service', error });
// //     }
// //   }

// //   // Update a specific service by its ID
// //   async updateService(req, res) {
// //     const { id } = req.params;
// //     const { serviceType, status } = req.body;

// //     try {
// //       const updatedService = await ServiceRepository.findByIdAndUpdate(id, { serviceType, status }, { new: true });

// //       if (!updatedService) {
// //         return res.status(404).json({ message: 'Service not found' });
// //       }

// //       return res.status(200).json({ message: 'Service updated successfully', updatedService });
// //     } catch (error) {
// //       return res.status(500).json({ message: 'Error updating service', error });
// //     }
// //   }

// //   // Delete a service
// //   async deleteService(req, res) {
// //     const { id } = req.params;
    
// //     try {
// //       const deletedService = await ServiceRepository.findByIdAndDelete(id);

// //       if (!deletedService) {
// //         return res.status(404).json({ message: 'Service not found' });
// //       }

// //       return res.status(200).json({ message: 'Service deleted successfully' });
// //     } catch (error) {
// //       return res.status(500).json({ message: 'Error deleting service', error });
// //     }
// //   }
// // }

// // export default new ServiceController();


// import ServiceRepository from '../Repositories/ServicesRepositories.mjs';

// class ServiceController {
//   // ✅ Create a new Service
//   async createService(req, res) {
//     try {
//       const { serviceType } = req.body;

//       if (!serviceType || typeof serviceType !== 'string' || serviceType.trim() === '') {
//         return res.status(400).json({ message: 'Valid serviceType is required' });
//       }

//       const newService = await ServiceRepository.create({ serviceType });
//       return res.status(201).json({
//         message: 'Service created successfully',
//         newService
//       });
//     } catch (error) {
//       return res.status(500).json({
//         message: 'Error creating service',
//         error: error.message
//       });
//     }
//   }

//   // ✅ Get all services
//   async getAllServices(req, res) {
//     try {
//       const services = await ServiceRepository.find();
//       return res.status(200).json({ services });
//     } catch (error) {
//       return res.status(500).json({
//         message: 'Error fetching services',
//         error: error.message
//       });
//     }
//   }

//   // ✅ Get a specific service by ID
//   async getServiceById(req, res) {
//     const { id } = req.params;

//     try {
//       const service = await ServiceRepository.findById(id);

//       if (!service) {
//         return res.status(404).json({ message: 'Service not found' });
//       }

//       return res.status(200).json({ service });
//     } catch (error) {
//       return res.status(500).json({
//         message: 'Error fetching service',
//         error: error.message
//       });
//     }
//   }

//   // ✅ Update a specific service by ID
//   async updateService(req, res) {
//     const { id } = req.params;
//     const { serviceType, status } = req.body;

//     try {
//       const updatedService = await ServiceRepository.findByIdAndUpdate(
//         id,
//         { serviceType, status },
//         { new: true }
//       );

//       if (!updatedService) {
//         return res.status(404).json({ message: 'Service not found' });
//       }

//       return res.status(200).json({
//         message: 'Service updated successfully',
//         updatedService
//       });
//     } catch (error) {
//       return res.status(500).json({
//         message: 'Error updating service',
//         error: error.message
//       });
//     }
//   }

//   // ✅ Delete a service
//   async deleteService(req, res) {
//     const { id } = req.params;

//     try {
//       const deletedService = await ServiceRepository.findByIdAndDelete(id);

//       if (!deletedService) {
//         return res.status(404).json({ message: 'Service not found' });
//       }

//       return res.status(200).json({ message: 'Service deleted successfully' });
//     } catch (error) {
//       return res.status(500).json({
//         message: 'Error deleting service',
//         error: error.message
//       });
//     }
//   }
// }

// export default new ServiceController();

import ServiceRepository from '../Repositories/ServicesRepositories.mjs';

class ServiceController {
  //  Create a new Service with duplicate check
  async createService(req, res) {
    try {
      const { serviceType, description } = req.body;

      if (!serviceType || typeof serviceType !== 'string' || serviceType.trim() === '') {
        return res.status(400).json({ message: 'Valid serviceType is required' });
      }

      // Check if serviceType already exists
      const existingService = await ServiceRepository.findOneByType(serviceType);

      //  Create the new service regardless of duplication
      const newService = await ServiceRepository.create({ serviceType, description });

      return res.status(201).json({
        message: existingService
          ? 'service created successfully'
          : 'Service created successfully',
        isDuplicate: !!existingService,
        newService
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error creating service',
        error: error.message
      });
    }
  }

  // Get all services
  async getAllServices(req, res) {
    try {
      const services = await ServiceRepository.find();
      return res.status(200).json({ services });
    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching services',
        error: error.message
      });
    }
  }

  //  Get a specific service by ID
  async getServiceById(req, res) {
    const { id } = req.params;

    try {
      const service = await ServiceRepository.findById(id);

      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      return res.status(200).json({ service });
    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching service',
        error: error.message
      });
    }
  }

  //  Update a specific service by ID
  async updateService(req, res) {
    const { id } = req.params;
    const { serviceType, status, description } = req.body;

    try {
      const updatedService = await ServiceRepository.findByIdAndUpdate(
        id,
        { serviceType, status, description },
        { new: true }
      );

      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found' });
      }

      return res.status(200).json({
        message: 'Service updated successfully',
        updatedService
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error updating service',
        error: error.message
      });
    }
  }

  //  Delete a service
  async deleteService(req, res) {
    const { id } = req.params;

    try {
      const deletedService = await ServiceRepository.findByIdAndDelete(id);

      if (!deletedService) {
        return res.status(404).json({ message: 'Service not found' });
      }

      return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      return res.status(500).json({
        message: 'Error deleting service',
        error: error.message
      });
    }
  }
}

export default new ServiceController();
