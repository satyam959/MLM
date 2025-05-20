import mongoose from "mongoose";

const rankHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    rankId: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "adt",  
      updatedAt: "utd",  
    },
  }
);

const RankHistory = mongoose.model("RankHistory", rankHistorySchema);
export default RankHistory;
