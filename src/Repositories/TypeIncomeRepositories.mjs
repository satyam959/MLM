import TypeIncome from '../Models/TypeIncomeModels.mjs';

class TypeIncomeRepository {

    // Create a new TypeIncome
    async create(data) {
        const newIncome = new TypeIncome(data);
        return await newIncome.save();
    }

    // Get all TypeIncomes
    async getAll() {
        return await TypeIncome.find();
    }

    // Get a TypeIncome by ID
    async getById(id) {
        return await TypeIncome.findById(id);
    }

    // Update a TypeIncome by ID
    async updateById(id, data) {
        return await TypeIncome.findByIdAndUpdate(id, data, { new: true });
    }

    // Delete a TypeIncome by ID
    async deleteById(id) {
        return await TypeIncome.findByIdAndDelete(id);
    }
}

export default new TypeIncomeRepository();
