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
  async findByIdAndUpdate(id, updateData, options = {}) {
    return await TypeIncome.findByIdAndUpdate(id, updateData, options);
  },

  //  Delete by ID
  async findByIdAndDelete(id) {
    return await TypeIncome.findByIdAndDelete(id);
  },

  //  Find by incomeType
  async findOneByType(incomeType) {
    return await TypeIncome.findOne({ incomeType });
  }

};

export default TypeIncomeRepository;
