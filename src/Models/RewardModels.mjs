import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    rankId: {
      type: Number,
      ref: 'Rank',
      required: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    dailyRoyalty: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // this will store the file path or URL
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    rewardId: {
      type: String,
      default: () => Math.floor(100000 + Math.random() * 900000).toString(),
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);


const Reward = mongoose.model("Reward", rewardSchema);

export default Reward;
