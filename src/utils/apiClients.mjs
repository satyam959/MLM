import axios from 'axios';

class ApiClient {
    static client = axios.create({
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    static async getMethod(url, config = {}) {
        try {
            const response = await this.client.get(url, config);
            return response.data;
        } catch (error) {
            console.error('GET Error:', error.response?.data || error.message);
            throw error;
        }
    }

    static async postMethod(url, data = {}, config = {}) {
        try {
            const response = await this.client.post(url, data, config);
            return response.data;
        } catch (error) {
            console.error('POST Error:', error.response?.data || error.message);
            throw error;
        }
    }
}

export default ApiClient;