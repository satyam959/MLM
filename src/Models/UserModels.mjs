import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: '',
  },
  pincode: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // enum: ['Admin', 'User'],  // Uncomment this line if you want to restrict roles
    default: '',  // Default role is User
  },
  status: {
    type: Boolean, 
    default: true, 
  },
  referralCode: {
    type: String,
    required: false, 
    unique: true, 
    default: '', 
  },
  userId: {
    type: Number,
    default: () => Math.floor(100000 + Math.random() * 900000),
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
});

// Methods and middleware
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  // Generate a unique referral code if it's not set
  if (!this.referralCode) {
    this.referralCode = generateReferralCode(); 
  }
  next();
});

function generateReferralCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase(); 
}

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
