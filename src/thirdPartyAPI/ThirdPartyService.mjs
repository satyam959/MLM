import UserWalletRepository from '../Repositories/user/userWalletRepositories.mjs';
import apiClient from '../utils/apiClients.mjs';
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables first


const { API_URL, API_TOKEN } = process.env;

class ThirdPartyService {

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

    static async billVerification(req, res) {
        try {
            const rawBody = req.body;

            const parsedBody = {};
            for (const key in rawBody) {
                const value = rawBody[key];
                // Convert to number only if it's a valid number string
                parsedBody[key] = await ThirdPartyService.isNumeric(value) ? Number(value) : value;
            }

            const postData = {
                api_token: API_TOKEN,
                type: 1,
                ...parsedBody
            };
            const response = await apiClient.postMethod(`${API_URL}telecom/v1/bill-verify`, postData);

            if (response) {
                return res.status(200).json({
                    success: true,
                    message: "Bill verified successfully",
                    data: response

                });
            }


        } catch (error) {
            console.log('Error in bill verification :', error);
            throw new Error('Failed to verify bill');
        }
    }

    static async isNumeric(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    static async payBill(req, res) {
        try {
            const userId = req.user.userId;
            const userWallet = await UserWalletRepository.findWalletByUserId(userId);
            const rawBody = req.body;
            if (!userWallet || Number(userWallet.balance) < rawBody.amount) {
                return res.status(400).json({
                    message: "Insufficient wallet balance. Please top-up your wallet.",
                    userBalance: userWallet ? Number(userWallet.balance) : 0,
                    required: Number(rawBody.amount)
                });
            }
            const postData = {
                api_token: API_TOKEN,
                type: 1,
                client_id: userId,
                ...rawBody
            };
            const response = await apiClient.postMethod(`${API_URL}telecom/v1/payment`, postData);
            if (response) {
                const status = response.status == "success" ? true : false;

                if (status == true) {
                    const userUpdatedBalance = Number(userWallet.balance) - Number(rawBody.amount)
                    await UserWalletRepository.updateUserWallet({ userId: userId }, { balance: userUpdatedBalance })
                }

                const message = status == true ? "Bill processed successfully" : "Something went wrong in bill processing";
                return res.status(200).json({
                    status: status,
                    message: message,
                    data: response
                });
            }
        } catch (error) {
            console.log('Error in bill payment :', error);
            throw new Error('Bill payment failed');
        }
    }

    static async findOperator(req, res) {
        try {
            const rawBody = req.body;
            const postData = {
                api_token: API_TOKEN,
                ...rawBody
            };
            const response = await apiClient.postMethod(`${API_URL}plan/v1/find-operator`, postData);
            if (response) {
                const status = response.status == "success" ? true : false;
                const message = status == true ? "Operator list fetched successfully" : "Something went wrong !!";
                return res.status(200).json({
                    status: status,
                    message: message,
                    data: response
                });
            }
        } catch (error) {
            console.log('Error in Operator list :', error);
            throw new Error('Operator list fetching error');
        }
    }

    static async prepaidPlan(req, res) {
        try {
            const rawBody = req.body;
            const postData = {
                api_token: API_TOKEN,
                ...rawBody
            };
            const response = await apiClient.postMethod(`${API_URL}plan/v1/prepaid-plan2`, postData);
            if (response) {
                const status = response.status == "success" ? true : false;
                const message = status == true ? "Prepaid plan fetched successfully" : "Something went wrong !!";
                return res.status(200).json({
                    status: status,
                    message: message,
                    data: response
                });
            }
        } catch (error) {
            console.log('Error in prepaid plan :', error);
            throw new Error('prepaid plan fetching error');
        }
    }

    static async rechargeNow(req, res) {
        try {
            const userId = req.user.userId;
            const userWallet = await UserWalletRepository.findWalletByUserId(userId);

            const rawBody = req.query;

            if (!userWallet || Number(userWallet.balance) < rawBody.amount) {
                return res.status(400).json({
                    message: "Insufficient wallet balance. Please top-up your wallet.",
                    userBalance: userWallet ? Number(userWallet.balance) : 0,
                    required: Number(rawBody.amount)
                });
            }

            const postData = {
                api_token: API_TOKEN,
                type: 1,
                client_id: userId,
                ...rawBody
            };
            const queryString = new URLSearchParams(postData).toString();
            const fullUrl = `${API_URL}telecom/v1/payment?${queryString}`;
            const response = await apiClient.getMethod(fullUrl);
            if (response) {
                const status = response.status == "success" ? true : false;
                if (status == true) {
                    const userUpdatedBalance = Number(userWallet.balance) - Number(rawBody.amount)
                    await UserWalletRepository.updateUserWallet({ userId: userId }, { balance: userUpdatedBalance })
                }
                const message = status == true ? "Bill processed successfully" : "Something went wrong in bill processing";
                return res.status(200).json({
                    status: status,
                    message: message,
                    data: response
                });
            }
        } catch (error) {
            console.log('Error in bill payment :', error);
            throw new Error('Bill payment failed');
        }
    }
}

export default ThirdPartyService;