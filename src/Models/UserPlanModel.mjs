import mongoose from 'mongoose';

const userPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    planId: {
      type: Number, 
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    userPlanId: {
      type: Number,
      default: () => Math.floor(100000 + Math.random() * 900000),
      unique: true,
    },
    expireAt: {
        type: Date,
        required: true,
      }      
  },
  {
    timestamps: true,
  }
);

const userPlan = mongoose.model('userPlan', userPlanSchema);
export default userPlan;
