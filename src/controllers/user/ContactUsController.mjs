import ContactUsRepository from "../../Repositories/user/contactUsRepositories.mjs";

class ContactUsController {
  async create(req, res) {
    try {
      const data = await ContactUsRepository.createContactUs(req.body);
      res.status(201).json({
        statusCode: 201,
        success: true,
        message: "Contact request created successfully",
        data
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Failed to create contact request",
        error: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const data = await ContactUsRepository.getAllContactUs();
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Fetched all contact requests successfully",
        data
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Failed to fetch contact requests",
        error: error.message
      });
    }
  }

  async getByToken(req, res) {
    try {
      const userId = req.userId;
      const data = await ContactUsRepository.getByUserId(userId);

      if (!data) {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: "No contact request found for this user"
        });
      }

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Fetched contact request successfully",
        data
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Failed to fetch contact request",
        error: error.message
      });
    }
  }

  async updateByUserId(req, res) {
    try {
      const userId = req.userId;
      const data = await ContactUsRepository.updateByUserId(userId, req.body);

      if (!data) {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: "No contact request found to update"
        });
      }

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Contact request updated successfully",
        data
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Failed to update contact request",
        error: error.message
      });
    }
  }

  async deleteByUserId(req, res) {
    try {
      const userId = req.userId;
      const data = await ContactUsRepository.deleteByUserId(userId);

      if (!data) {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: "No contact request found to delete"
        });
      }

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Contact request deleted successfully"
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Failed to delete contact request",
        error: error.message
      });
    }
  }
}

export default new ContactUsController();
