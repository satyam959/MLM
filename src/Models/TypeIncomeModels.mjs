import mongoose from "mongoose";

const TypeIncomeSchema = new mongoose.Schema({
    incomeType: {
        type: String,
        required: true
    },
    incomeTypeId: {
        type: Number,
        default: () => Math.floor(100000 + Math.random() * 900000),
        unique: true
    },
    status: {
        type: Boolean,
        default: true // true = Active, false = Inactive
    }
}, { timestamps: true });

const TypeIncome = mongoose.model("TypeIncome", TypeIncomeSchema);
export default TypeIncome;
