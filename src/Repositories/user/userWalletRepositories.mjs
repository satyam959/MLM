import Wallet from '../../Models/WalletModels.mjs';
import WalletHistory from '../../Models/WalletHistory.mjs';

const UserWalletRepository = {
    async findWalletByUserId(userId) {
        try {
            return await Wallet.findOne({ userId });
        } catch (error) {
            console.error('Error fetching wallet by userId:', error);
            throw error;
        }
    },

    async createWallet(walletData) {
        const wallet = new Wallet(walletData);
        return await wallet.save();
    },

    async createWalletHistory(walletHistory) {
        const wallet = new WalletHistory(walletHistory);
        return await wallet.save();
    }

};

export default UserWalletRepository;
