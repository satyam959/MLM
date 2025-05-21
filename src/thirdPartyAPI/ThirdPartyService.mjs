import apiClient from '../utils/apiClients.mjs';
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables first

const { API_URL, API_TOKEN } = process.env;

class ThirdPartyService {
    static async getProvider(req, res) {
        try {
            console.log("API_URL --", API_URL);
            const data = { api_token: API_TOKEN };
            const response = await apiClient.postMethod(`${API_URL}application/v1/get-provider`, data);
            console.log("response -- ", response);
            if (response) {
                return res.status(200).json({
                    success: true,
                    message: "Provider data fetched successfully",
                    data: response
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Provider list not available",
                    data: []
                });
            }

        } catch (error) {
            console.error('Error Getting Provider Data:', error.response?.data || error.message);
            throw new Error('Failed to get Provider Data');
        }
    }
}

export default ThirdPartyService;