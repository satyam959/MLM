// // import Service from '../Models/ServicesModel.mjs'; // Import your Mongoose model

// // const ServiceRepository = {
// //   // Create a new service
// //   async create(data) {
// //     const newService = new Service(data);
// //     return await newService.save();
// //   },

// //   // Get all services
// //   async find() {
// //     return await Service.find();
// //   },

// //   // Get a service by ID
// //   async findById(id) {
// //     return await Service.findById(id);
// //   },

// //   // Update a service by ID
// //   async findByIdAndUpdate(id, updateData, options = {}) {
// //     return await Service.findByIdAndUpdate(id, updateData, options);
// //   },

// //   // Delete a service by ID
// //   async findByIdAndDelete(id) {
// //     return await Service.findByIdAndDelete(id);
// //   }
// // };

// // export default ServiceRepository;


// import Service from '../Models/ServicesModel.mjs';

// const ServiceRepository = {
//   async create(data) {
//     const newService = new Service(data);
//     return await newService.save();
//   },

//   async find() {
//     return await Service.find();
//   },

//   async findById(id) {
//     return await Service.findById(id);
//   },

//   async findByIdAndUpdate(id, updateData, options = {}) {
//     return await Service.findByIdAndUpdate(id, updateData, options);
//   },

//   async findByIdAndDelete(id) {
//     return await Service.findByIdAndDelete(id);
//   }
// };

// export default ServiceRepository;

import Service from '../Models/ServicesModel.mjs';

const ServiceRepository = {
  //  Create a new service
  async create(data) {
    const newService = new Service(data);
    return await newService.save();
  },

  // Get all services
  async find() {
    return await Service.find();
  },

  //  Get a service by MongoDB ObjectId (if still used)
  async findById(serviceId) {
    return await Service.findById(serviceId);
  },

  async findByIdAndUpdate(serviceId, updateData, options = {}) {
    console.log(updateData);
    return await Service.findOneAndUpdate({ serviceId: Number(serviceId) }, updateData, options);
  },
  
  async findByIdAndDelete(serviceId) {
    return await Service.findOneAndDelete({ serviceId: Number(serviceId) });
  },
  

  
  async findOneByType(serviceType) {
    return await Service.findOne({ serviceType });
  }
};

export default ServiceRepository;
