// import TypeIncome from '../Models/TypeIncomeModels.mjs';

// const TypeIncomeRepository = {
//   // Create new income type
//   async create(data) {
//     const newType = new TypeIncome(data);
//     return await newType.save();
//   },

//   // Find all
//   async find() {
//     return await TypeIncome.find();
//   },

//   //  Find by ID
//   async findById(incomeId) {
//     return await TypeIncome.findById(incomeId);
//   },

//   //  Update by ID
//   async findByIdAndUpdate(incomeId, updateData, options = {}) {
//     return await TypeIncome.findByIdAndUpdate(incomeId, updateData, options);
//   },

//   //  Delete by ID
//   async findByIdAndDelete(incomeId) {
//     return await TypeIncome.findByIdAndDelete(incomeId);
//   },

//   //  Find by incomeType
//   async findOneByType(incomeId) {
//     return await TypeIncome.findOne({ incomeId});
//   }

// };

// export default TypeIncomeRepository;


import TypeIncome from '../Models/TypeIncomeModels.mjs';

const TypeIncomeRepository = {
  // Create new income type
  async create(data) {
    const newType = new TypeIncome(data);
    return await newType.save();
  },
  // Other methods...


  // Find all TypeIncome entries
  async find() {
    try {
      return await TypeIncome.find();
    } catch (error) {
      throw new Error(`Error fetching all TypeIncomes: ${error.message}`);
    }
  },

  // Find TypeIncome by ID
  async findById(incomeId) {
    try {
      return await TypeIncome.findById(incomeId);
    } catch (error) {
      throw new Error(`Error fetching TypeIncome by ID: ${error.message}`);
    }
  },

  // Update TypeIncome by ID
  async findByIdAndUpdate(incomeId, updateData, options = {}) {
    try {
      return await TypeIncome.findByIdAndUpdate(incomeId, updateData, options);
    } catch (error) {
      throw new Error(`Error updating TypeIncome by ID: ${error.message}`);
    }
  },

  // Delete TypeIncome by ID
  async findByIdAndDelete(incomeId) {
    try {
      return await TypeIncome.findByIdAndDelete(incomeId);
    } catch (error) {
      throw new Error(`Error deleting TypeIncome by ID: ${error.message}`);
    }
  },

  // Find TypeIncome by incomeType
  async findOneByType(incomeType) {
    try {
      return await TypeIncome.findOne({ incomeType });
    } catch (error) {
      throw new Error(`Error fetching TypeIncome by incomeType: ${error.message}`);
    }
  }
};


export default TypeIncomeRepository;
