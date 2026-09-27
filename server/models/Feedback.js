import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  date: { type: String, required: true },
  packageId: { type: String, required: true },
  packageName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  categories: [{ type: String }],
  comment: { type: String },
}, { timestamps: true });

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
