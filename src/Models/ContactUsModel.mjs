import mongoose from 'mongoose';

const contactUsSchema = new mongoose.Schema({
  customerCare: String,
  supportHours: String,
  supportEmail: String,
  address: String,
  userId: {
    type: String,
    unique: true,
    required: true,
    default: () => Math.floor(100000 + Math.random() * 900000).toString()  
  }
}, {
  timestamps: true
});

const ContactUsModel = mongoose.model('ContactUs', contactUsSchema);

export default ContactUsModel;