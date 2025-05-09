import Wallet from '../../Models/WalletModels.mjs';

const UserWalletRepository = {
    async findWalletByUserId(userId) {
        try {
            return await Wallet.findOne({ userId });
        } catch (error) {
            console.error('Error fetching wallet by userId:', error);
            throw error;
        }
    },
};

export default UserWalletRepository;
