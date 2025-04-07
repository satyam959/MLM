import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'Mobile Recharge', 
      'DTH', 
      'Fastag', 
      'Electricity Bill', 
      'Gas Piped Bill',
      'Water Bill', 
      'Loan & EMI', 
      'LIC/Insurance', 
      'Broadband'
    ],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: function() {
      return this.type === 'Mobile Recharge'; // Only required for Mobile Recharge
    }
  },
  amount: {
    type: Number,
    required: true
  },
  dthProvider: {
    type: String,
    required: function() {
      return this.type === 'DTH'; // Only required for DTH services
    }
  },
  vehicleNumber: {
    type: String,
    required: function() {
      return this.type === 'Fastag'; // Only required for Fastag
    }
  },
  consumerNumber: {
    type: String,
    required: function() {
      return ['Electricity Bill', 'Gas Piped Bill', 'Water Bill'].includes(this.type);
    }
  },
  loanNumber: {
    type: String,
    required: function() {
      return this.type === 'Loan & EMI'; // Only required for Loan & EMI
    }
  },
  policyNumber: {
    type: String,
    required: function() {
      return this.type === 'LIC/Insurance'; // Only required for LIC/Insurance
    }
  },
  provider: {
    type: String,
    required: function() {
      return this.type === 'Broadband'; // Only required for Broadband
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'in-progress'],
    default: 'pending' // Default status is 'pending'
  }
}, {
  timestamps: true // This will add createdAt and updatedAt timestamps
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
