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
import mongoose from 'mongoose';
import multer from 'multer';
import upload from '../middelware/UploadImage.mjs';

class ServiceController {
//   // Create a new Service with duplicate check
// async createService(req, res) {
//   try {
//     const { serviceName, image, colour } = req.body;

//     // Validate serviceType
//     if (!serviceName || typeof serviceName !== 'string' || serviceName.trim() === '') {
//       return res.status(400).json({ message: 'Valid serviceType is required' });
//     }

//     // Validate image (optional, only if you require it)
//     if (image && (typeof image !== 'string' || image.trim() === '')) {
//       return res.status(400).json({ message: 'Valid image name or URL is required' });
//     }

//     // Validate colour (optional)
//     if (colour && (typeof colour !== 'string' || colour.trim() === '')) {
//       return res.status(400).json({ message: 'Valid colour value is required' });
//     }

//     // Check if serviceType already exists
//     const existingService = await ServiceRepository.findOneByType(serviceName);

//     // Create the new service
//     const newService = await ServiceRepository.create({ serviceName, image, colour });

//     return res.status(201).json({
//       message: existingService
//         ? 'Service created successfully '
//         : 'Service created successfully',
//       isDuplicate: !!existingService,
//       newService
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Error creating service',
//       error: error.message
//     });
//   }
// }
async createService(req, res) {
  try {
    const { serviceName, image, colour } = req.body;

    // Validate serviceName
    if (!serviceName || typeof serviceName !== 'string' || serviceName.trim() === '') {
      return res.status(400).json({ message: 'Valid service name is required' });
    }

    // Validate image (optional)
    if (image && (typeof image !== 'string' || image.trim() === '')) {
      return res.status(400).json({ message: 'Valid image name or URL is required' });
    }

    // Validate colour (optional)
    if (colour && (typeof colour !== 'string' || colour.trim() === '')) {
      return res.status(400).json({ message: 'Valid colour value is required' });
    }

    // Check if service already exists
    const existingService = await ServiceRepository.findOneByType(serviceName);

    // Optionally prevent duplicate creation (uncomment below if needed)
    // if (existingService) {
    //   return res.status(409).json({ message: 'Service with this name already exists' });
    // }

    // Create the new service
    const newService = await ServiceRepository.create({ serviceName, image, colour });

    return res.status(201).json({
      message: 'Service created successfully',
      newService,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error creating service',
      error: error.message,
    });
  }
}


  // Get all services
  async getAllServices(req, res) {
    try {
      const services = await ServiceRepository.find();
      console.log(services)
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

  // ✅ Update a specific service by custom ID
  async updateService(req, res) {
    const { serviceId } = req.params;
    const { serviceType, status, description } = req.body;
console.log(req.body)
    try {
      const updatedService = await ServiceRepository.findByIdAndUpdate(
        serviceId,
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

  // ✅ Delete a service by custom ID
  async deleteService(req, res) {
    const { serviceId } = req.params;

    try {
      const deletedService = await ServiceRepository.findByIdAndDelete(serviceId);
      
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
