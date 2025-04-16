// import mongoose from 'mongoose';

// const serviceSchema = new mongoose.Schema({
//     serviceType: {
//         type: String,
//         required: true
//     },
//     description: {
//       type: String,
//     },
//     serviceId: {
//         type: Number,
//         default: () => Math.floor(100000 + Math.random() * 900000),
//         unique: true
//     },
//     status: {
//         type: Boolean,
//         default: true // true = Active, false = Inactive
//     }
// }, { timestamps: true });

// const Service = mongoose.model('Service', serviceSchema);

// export default Service;




import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true // ✅ No unique: true here, so duplicates are allowed
  },
  description: {
    type: String,
  },
  serviceId: {
    type: Number,
    default: () => Math.floor(100000 + Math.random() * 900000),
    unique: true // This is fine; only serviceId needs to be unique
  },
  status: {
    type: Boolean,
    default: true // true = Active, false = Inactive
  }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;

