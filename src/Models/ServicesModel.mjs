import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },
    serviceIcon: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },

    serviceId: {
      type: Number,
      default: () => Math.floor(100000 + Math.random() * 900000),
      unique: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active', 
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;
