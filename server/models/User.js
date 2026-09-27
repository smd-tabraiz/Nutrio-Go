import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  rollOrEmpId: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  currentPackageId: { type: String },
  currentPackageName: { type: String },
  currentPackageQuantity: { type: String },
  membershipStatus: {
    type: String,
    enum: ['none', 'trial', 'trial_completed', 'monthly', 'not_continued'],
    default: 'none',
  },
  trialDay: { type: Number, default: 0 },
  trialStartDate: { type: String },
  trialEndDate: { type: String },
  monthlyStartDate: { type: String },
  remainingServiceDays: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'paid' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
