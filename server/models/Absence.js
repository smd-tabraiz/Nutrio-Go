import mongoose from 'mongoose';

const AbsenceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  originalPackage: { type: String, required: true },
  originalQuantity: { type: String, required: true },
  absenceDate: { type: String, required: true },
  replacementItem: { type: String, required: true },
  replacementQuantity: { type: String, default: '200 g' },
  requestDate: { type: String, required: true },
  status: { type: String, default: 'confirmed' },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Absence || mongoose.model('Absence', AbsenceSchema);
