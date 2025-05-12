

import ServiceRepository from '../Repositories/ServicesRepositories.mjs';
import mongoose from 'mongoose';
import { getUploadMiddleware } from '../middelware/UploadImage.mjs'; // ✅ correct


class ServiceController {
async createService(req, res) {
  try {
    const { serviceName , category} = req.body;


    if (!serviceName || typeof serviceName !== 'string' || serviceName.trim() === '') {
      return res.status(400).json({
        statusCode: 400,
        message: 'Valid service name is required',
      });
    }
    if (!category || typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({
        statusCode: 400,
        message: 'Valid category name is required',
      });
    }

     const serviceIcon = req.file?.fullUrl;
    // if (!serviceIcon) {
    //   return res.status(400).json({
    //     statusCode: 400,
    //     message: 'Service icon image is required',
    //   });
    // }


    const existingService = await ServiceRepository.findOneByType(serviceName);
    if (existingService) {
      return res.status(409).json({
        statusCode: 409,
        message: 'Service with this name already exists',
      });
    }

    const newService = await ServiceRepository.create({
      serviceName,
      serviceIcon,
      category
    });

    return res.status(201).json({
      statusCode: 200,
      message: 'Service created successfully',
      newService,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Error creating service',
      error: error.message,
    });
  }
}
  // Get all services
async getAllServices(req, res) {
  try {
    const services = await ServiceRepository.find();

    return res.status(200).json({
      statusCode: 200,
      message: 'Services fetched successfully',
      services,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: 'Error fetching services',
      error: error.message,
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
