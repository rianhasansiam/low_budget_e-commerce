'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle, AlertCircle, Camera, Upload } from 'lucide-react';
import { useAddData } from '@/lib/hooks/useAddData';
import { uploadToImageBB } from '@/lib/imagebb';
import Image from 'next/image';

export default function ReviewForm({ productId, productName, onClose, onSuccess }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [userAvatar, setUserAvatar] = useState(session?.user?.image || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Use optimistic updates hook
  const { addData, isPending, error } = useAddData({
    api: '/api/reviews',
    name: 'reviews'
  });

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    setUploadingAvatar(true);
    try {
      const imageUrl = await uploadToImageBB(file);
      setUserAvatar(imageUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!session) {
      router.push('/login');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      await addData({
        productId,
        productName,
        rating,
        title: title.trim() || 'Great Product!',
        comment: comment.trim(),
        userAvatar: userAvatar || session?.user?.image || null, // Include avatar
        verified: true
      });

      setShowSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
        <p className="text-gray-600 mb-6">You need to be logged in to write a review</p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
        <p className="text-gray-600">
          Thank you for your review. It will be published after admin approval.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-1">Reviewing:</p>
        <p className="font-semibold text-gray-900">{productName}</p>
      </div>

      {/* User Avatar Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Your Profile Picture (Optional)
        </label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {userAvatar || session?.user?.image ? (
              <Image
                src={userAvatar || session?.user?.image}
                alt="User avatar"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
              <Camera className="w-4 h-4" />
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Upload your photo to personalize your review (Max 2MB)
            </p>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0 && (
              <span className="font-medium">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Review Title (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Great camera for beginners"
          maxLength={100}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={5}
          maxLength={500}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error submitting review</p>
            <p className="text-sm text-red-600 mt-1">{error.message || 'Please try again'}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || rating === 0 || !comment.trim()}
          className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isPending ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center">
        Your review will be published after admin approval
      </p>
    </form>
  );
}
