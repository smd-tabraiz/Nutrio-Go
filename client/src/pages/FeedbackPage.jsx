import React, { useState } from 'react';
import { useNutriGo } from '../context/NutriGoContext';
import {
  Star,
  MessageSquareHeart,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeedbackPage() {
  const { currentUser, feedback, submitFeedback } = useNutriGo();

  const [rating, setRating] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState([
    'Freshness',
    'Taste',
  ]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [filterCat, setFilterCat] = useState('all');

  const categoriesList = [
    'Freshness',
    'Taste',
    'Quantity',
    'Packaging',
    'Delivery',
    'Overall experience',
  ];

  const handleCategoryToggle = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitFeedback(rating, selectedCategories, comment);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2D5A27', '#4A7C59', '#D4A373'],
        });
      } catch (e) {
        console.error(e);
      }
      setTimeout(() => {
        setIsSuccess(false);
        setComment('');
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFeedback = feedback.filter((item) => {
    if (filterCat === 'all') return true;
    return item.categories.includes(filterCat);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3E8] border border-emerald-200 text-xs font-semibold text-[#2D5A27]">
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Community Feedback</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1E3F20]">Today&apos;s Feedback</h1>
        <p className="text-sm text-[#5C675E]">
          We take pride in preparing pure, crisp and energizing food portions. Tell us how today&apos;s package felt!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-5 sticky top-28">
          <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-3">
            <h2 className="text-base font-bold text-[#1E3F20]">Share Your Experience</h2>
            <span className="text-[11px] text-[#5C675E]">Optional & Non-Mandatory</span>
          </div>

          {isSuccess ? (
            <div className="p-8 bg-[#EBF3E8] rounded-2xl text-center space-y-3">
              <span className="text-4xl">🌟</span>
              <h3 className="text-lg font-bold text-[#2D5A27]">Thank You!</h3>
              <p className="text-xs text-[#465849] leading-relaxed">
                Your feedback has been recorded for the kitchen team.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-center py-2 bg-[#FAF9F5] p-3 rounded-2xl border border-[#EDF3EC]">
                <label className="text-xs font-bold text-[#1E3F20] block">
                  How was today&apos;s NutriGo?
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-[#5C675E] font-medium block">
                  {rating === 5
                    ? 'Superb & Fresh! 🥗'
                    : rating === 4
                    ? 'Very Good 👍'
                    : rating === 3
                    ? 'Satisfactory 👌'
                    : 'Needs Improvement'}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#334139] block">
                  Optional Feedback Categories:
                </label>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {categoriesList.map((cat) => {
                    const isSel = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                          isSel
                            ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                            : 'bg-[#FAF9F5] text-[#5C675E] border-[#D5E2D2] hover:bg-[#F3F8F1]'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#334139] block">
                  Tell us more...
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="E.g., sprouts were very fresh and crunchy! Loved the lemon seasoning."
                  className="w-full p-3 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                ></textarea>
              </div>

              <div className="text-[11px] text-[#5C675E] flex items-center justify-between">
                <span>Submitting as:</span>
                <strong className="text-[#1E3F20]">{currentUser?.name || 'Guest'}</strong>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-xs font-semibold shadow-soft hover:shadow-md transition disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          )}
        </div>

        {/* Right Community Feedback Wall */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <h2 className="text-lg font-bold text-[#1E3F20]">Recent Campus Feedback</h2>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <span className="text-[#5C675E]">Filter:</span>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="p-1.5 rounded-lg border border-[#D5E2D2] bg-white text-xs text-[#1E3F20]"
              >
                <option value="all">All Categories</option>
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFeedback.map((fb) => (
              <div
                key={fb.id}
                className="bg-white rounded-3xl p-5 border border-[#E5EBE3] shadow-soft space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[#1E3F20]">{fb.userName}</h4>
                    <p className="text-[11px] text-[#4A7C59] font-medium">{fb.packageName}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 justify-end">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= fb.rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#5C675E]">{fb.date}</span>
                  </div>
                </div>

                <p className="text-xs text-[#334139] leading-relaxed bg-[#FAF9F5] p-3 rounded-2xl border border-[#EDF3EC]">
                  &ldquo;{fb.comment}&rdquo;
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {fb.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-[#EBF3E8] text-[#2D5A27] text-[10px] font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
