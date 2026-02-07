import React, { useState } from 'react';
import { Star } from 'lucide-react';

const FeedbackPage = () => {
  const [rating, setRating] = useState(3); // Default 3 stars (ตามรูป)
  const [feedback, setFeedback] = useState('');

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-sans text-slate-800">
      
      {/* Header (Not Now) */}
      <div className="flex justify-end pt-2">
        <button className="text-slate-400 font-semibold text-sm hover:text-slate-600">
          Not Now
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-10">
        
        {/* Logo with Glow Effect */}
        <div className="relative mb-8">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 bg-cyan-100 rounded-full opacity-50 blur-sm transform scale-125"></div>
            {/* Inner Circle */}
            <div className="relative w-24 h-24 bg-cyan-50 rounded-full flex items-center justify-center z-10">
                 {/* Logo C Placeholder */}
                <div className="w-12 h-12 rounded-full border-4 border-[#6CD2D9] border-t-yellow-400 flex items-center justify-center">
                   <span className="text-[#6CD2D9] font-bold text-xl">C</span>
                </div>
            </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          Enjoying Carb Partner?
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Tap the stars to rate your experience
        </p>

        {/* Star Rating System */}
        <div className="flex gap-4 mb-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                size={32} 
                className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"} 
                strokeWidth={2}
              />
            </button>
          ))}
        </div>

        {/* Feedback Input */}
        <div className="w-full space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">What do you love?</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your experience..."
            className="w-full h-32 p-4 rounded-2xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6CD2D9] resize-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 mb-4">
        <button className="w-full bg-[#6CD2D9] hover:bg-[#5bc0c7] text-white font-bold py-4 rounded-full shadow-lg transition duration-200 text-lg">
          Submit Feedback
        </button>
      </div>

    </div>
  );
};

export default FeedbackPage;