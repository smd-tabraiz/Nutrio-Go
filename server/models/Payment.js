import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  packageId: { type: String, required: true },
  packageName: { type: String, required: true },
  planType: { type: String, enum: ['trial', 'monthly'], required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['paid', 'pending'], default: 'paid' },
  paymentMethod: { type: String, default: 'UPI' },
  transactionRef: { type: String },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
