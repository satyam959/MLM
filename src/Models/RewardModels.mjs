// import mongoose from "mongoose";


// const rewardSchema = new mongoose.Schema(
//   {
//     rankId: {
//       type: Number,
//       ref: Rank,
//       item: Number,
//       require: true,
//     },
//     benefits: {
//       type: String,
//       require: true,
//     },
//     dailyRoyalty: {
//       type: Number,
//       require: true,
//     },
//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "active",
//     },
//     rewardId: {
//       type: String,
//       default: () => Math.floor(100000 + Math.random() * 900000),
//       unique: true,
//       required: true,
//     },
   
//   },
//   { timestamps: true }
// );

// const Reward = mongoose.model("Reward", rewardSchema);

// export default Reward;


import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    rankId: {
      type: Number,
      ref: 'Rank', // This should be the model name as a string
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
