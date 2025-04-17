import TypeIncome from '../Models/TypeIncomeModels.mjs';

const TypeIncomeRepository = {
  // Create new income type
  async create(data) {
    const newType = new TypeIncome(data);
    return await newType.save();
  },

  // Find all
  async find() {
    return await TypeIncome.find();
  },

  //  Find by ID
  async findById(incomeId) {
    return await TypeIncome.findById(incomeId);
  },

  //  Update by ID
  async findByIdAndUpdate(incomeId, updateData, options = {}) {
    return await TypeIncome.findByIdAndUpdate(incomeId, updateData, options);
  },

  //  Delete by ID
  async findByIdAndDelete(incomeId) {
    return await TypeIncome.findByIdAndDelete(incomeId);
  },

  //  Find by incomeType
  async findOneByType(incomeId) {
    return await TypeIncome.findOne({ incomeId});
  }

};

export default TypeIncomeRepository;
