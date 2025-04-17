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
  async findById(id) {
    return await TypeIncome.findById(id);
  },

  //  Update by ID
  async findByIdAndUpdate(incomeTypeId, updateData, options = {}) {
    return await TypeIncome.findByIdAndUpdate(incomeTypeId, updateData, options);
  },

  //  Delete by ID
  async findByIdAndDelete(id) {
    return await TypeIncome.findByIdAndDelete(incomeTypeId);
  },

  //  Find by incomeType
  async findOneByType(incomeTypeId) {
    return await TypeIncome.findOne({ incomeTypeId});
  }

};

export default TypeIncomeRepository;
