import mongoose from 'mongoose';

const userRewardSchema = new mongoose.Schema(
  {
    userId: { type: Number, required:false, unique: true }, 

    rewardId: {
      type: Number, 
      required: true,
    },
    status: {
        type: String,
        enum: ['Achieved', 'Unachieved'],
        default: 'Unachieved',
      },
      
  },
  { timestamps: true }
);

const UserReward = mongoose.model('UserReward', userRewardSchema);
export default UserReward;
