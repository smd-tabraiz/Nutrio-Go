import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRollOrEmpId: { type: String, required: true },
  department: { type: String, required: true },
  packageId: { type: String, required: true },
  packageName: { type: String, required: true },
  quantity: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: {
    type: String,
    enum: ['received', 'pending', 'not_received', 'absent'],
    default: 'pending',
  },
  receivedAt: { type: String },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Delivery || mongoose.model('Delivery', DeliverySchema);
