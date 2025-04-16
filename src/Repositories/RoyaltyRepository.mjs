import RoyaltyModel from '../Models/RoyaltyModel.mjs';

const RoyaltyRepository = {
  async find() {
    return await RoyaltyModel.find();
  },

  async findById(id) {
    return await RoyaltyModel.findById(id);
  },

  async create(data) {
    const royalty = new RoyaltyModel(data);
    return await royalty.save();
  },

  async update(id, data) {
    return await RoyaltyModel.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id) {
    return await RoyaltyModel.findByIdAndDelete(id);
  }
};

export default RoyaltyRepository;
