import ContactUsModel from "../../Models/ContactUsModel.mjs";

class ContactUsRepository {
  async createContactUs(data) {
    return await ContactUsModel.create(data);
  }

  async getAllContactUs() {
    return await ContactUsModel.find();
  }

  async getByUserId(userId) {
    return await ContactUsModel.findOne({ userId });
  }

  async updateByUserId(userId, data) {
    return await ContactUsModel.findOneAndUpdate({ userId }, data, { new: true });
  }
  
  async deleteByUserId(userId) {
    return await ContactUsModel.findOneAndDelete({ userId });
  }
}  
export default new ContactUsRepository();
