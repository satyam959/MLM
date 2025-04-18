import TypeIncome from '../Repositories/TypeIncomeRepositories.mjs'

class TypeIncomeController {
    // ✅ Create a new TypeIncome (save even if duplicate)
    async createTypeIncome(req, res) {
        try {
            const { incomeType } = req.body;

            // Check for existing entry with the same incomeType
            const existingIncome = await TypeIncome.findOneByType(incomeType);

            // Save the new income regardless of duplication
            const newIncome = await TypeIncome.create(req.body);

            if (existingIncome) {
                
            }

            res.status(201).json({
                message: 'TypeIncome created successfully',
                // isDuplicate: false,
                data: newIncome
            });

        } catch (error) {
            console.error('Error creating TypeIncome:', error);
            res.status(400).json({ message: error.message });
        }
    }

    // Get all TypeIncomes
    async getAllTypeIncomes(req, res) {
        try {
            const incomes = await TypeIncome.find();
            res.status(200).json(incomes);
        } catch (error) {
            console.error('Error fetching all TypeIncomes:', error);
            res.status(400).json({ message: error.message });
        }
    }

    // Get a specific TypeIncome by ID
    async getTypeIncomeById(req, res) {
        try {
            const income = await TypeIncome.findById(req.params.incomeId);
            if (!income) {
                return res.status(404).json({ message: 'TypeIncome not found' });
            }
            res.status(200).json(income);
        } catch (error) {
            console.error('Error fetching TypeIncome by ID:', error);
            res.status(400).json({ message: error.message });
        }
    }

    // Update a TypeIncome by ID
    async updateTypeIncome(req, res) {
        try {
            const updatedIncome = await TypeIncome.findByIdAndUpdate(req.params.incomeId, req.body, { new: true });
            if (!updatedIncome) {
                return res.status(404).json({ message: 'TypeIncome not found' });
            }
            res.status(200).json(updatedIncome);
        } catch (error) {
            console.error('Error updating TypeIncome:', error);
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a TypeIncome by ID
    async deleteTypeIncome(req, res) {
        try {
            const deletedIncome = await TypeIncome.findByIdAndDelete(req.params.incomeId);
            if (!deletedIncome) {
                return res.status(404).json({ message: 'TypeIncome not found' });
            }
            res.status(200).json({ message: 'TypeIncome deleted successfully' });
        } catch (error) {
            console.error('Error deleting TypeIncome:', error);
            res.status(400).json({ message: error.message });
        }
    }
}

export default new TypeIncomeController();
