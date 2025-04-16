import RoyaltyModel from '../Models/RoyaltyModel.mjs';

class RoyaltyRepository {
  constructor() {
    this.data = Array.isArray(royaltyRanks) ? [...royaltyRanks] : [];
  }

  async getAll() {
    return this.data.map(({ id, dailyRoyalty }) => ({ id, dailyRoyalty }));
  }

  async getById(id) {
    const item = this.data.find(item => item.id === id);
    return item || null;
  }

  async create({ rank, dailyRoyalty, status }) {
    const newId = this.data.length > 0
      ? Math.max(...this.data.map(item => item.id)) + 1
      : 1;

    const newItem = {
      id: newId,
      rank,
      dailyRoyalty,
      status: status || 'active'
    };

    this.data.push(newItem);
    return newItem;
  }

  async update(id, { rank, dailyRoyalty, status }) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;

    if (rank !== undefined) this.data[index].rank = rank;
    if (dailyRoyalty !== undefined) this.data[index].dailyRoyalty = dailyRoyalty;
    if (status !== undefined) this.data[index].status = status;

    return this.data[index];
  }

  async delete(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;

    const deleted = this.data.splice(index, 1)[0];
    return deleted;
  }
};

export default RoyaltyRepository;
