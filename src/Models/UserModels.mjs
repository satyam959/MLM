// Models/UserModels.mjs
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
    // enum: ['Admin', 'User'],  // Limit the role to 'Admin' or 'User'
    default: '',  // Default role is User
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
  next();
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
