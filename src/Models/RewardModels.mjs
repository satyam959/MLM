import mongoose from "mongoose";


const rewardSchema = new mongoose.Schema(
  {
    rankId: {
      type: Number,
      Rank: Number,
      item: Number,
      require: true,
    },
    benefits: {
      type: String,
      require: true,
    },
    dailyRoyalty: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    rewardId: {
      type: String,
      default: () => Math.floor(100000 + Math.random() * 900000),
      unique: true,
      required: true,
    },
   
  },
  { timestamps: true }
);

const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;
