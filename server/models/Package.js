import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  items: [{ type: String, required: true }],
  quantity: { type: String, required: true },
  dailyPrice: { type: Number, required: true },
  trialDays: { type: Number, default: 7 },
  trialPrice: { type: Number, required: true },
  monthlyDays: { type: Number, default: 26 },
  monthlyPrice: { type: Number, required: true },
  icon: { type: String, required: true },
  color: { type: String, default: '#2D5A27' },
  description: { type: String },
  isPopular: { type: Boolean, default: false },
});

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);
