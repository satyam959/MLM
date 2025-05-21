import apiClient from '../utils/apiClients.mjs';
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables first

const { API_URL, API_TOKEN } = process.env;

class ThirdPartyService {
    // static async getProvider(req, res) {
    //     try {
    //         const searchParams = req.query.search
    //         console.log("searchParams --", searchParams);
    //         const data = { api_token: API_TOKEN };
    //         const response = await apiClient.postMethod(`${API_URL}application/v1/get-provider`, data);
    //         console.log("response -- ", response);
    //         if (response) {
    //             return res.status(200).json({
    //                 success: true,
    //                 message: "Provider data fetched successfully",
    //                 data: response
    //             });
    //         } else {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Provider list not available",
    //                 data: []
    //             });
    //         }

    //     } catch (error) {
    //         console.error('Error Getting Provider Data:', error.response?.data || error.message);
    //         throw new Error('Failed to get Provider Data');
    //     }
    // }


    static async getProvider(req, res) {
        try {
            const searchQuery = req.query.search?.trim().toLowerCase() || '';

            const data = { api_token: API_TOKEN };
            const response = await apiClient.postMethod(`${API_URL}application/v1/get-provider`, data);

            const providers = response?.providers || [];

            if (Array.isArray(providers)) {
                let filteredProviders = providers;

                if (searchQuery !== '') {
                    filteredProviders = providers.filter((provider) =>
                        provider.provider_name.toLowerCase().includes(searchQuery)
                    );
                }

                return res.status(200).json({
                    success: true,
                    message: "Provider data fetched successfully",
                    data: {
                        providers: filteredProviders
                    }
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Provider list not available",
                    data: {
                        providers: []
                    }
                });
            }

        } catch (error) {
            console.error('Error Getting Provider Data:', error.response?.data || error.message);
            throw new Error('Failed to get Provider Data');
        }
    }

    static async providerValidation(req, res) {
        try {
            const postData = { api_token: API_TOKEN, provider_id: req.query.provider_id };
            const response = await apiClient.postMethod(`${API_URL}telecom/v1/provider-validation`, postData);
            return res.status(200).json({
                data: response
            });

        } catch (error) {
            console.error('Error Getting Provider Data:', error.response?.data || error.message);
            throw new Error('Failed to get Provider Data');
        }
    }
}

export default ThirdPartyService;