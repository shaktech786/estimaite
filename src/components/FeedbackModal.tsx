'use client';

import { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'bug' | 'feature' | 'general' | 'privacy';

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: feedbackType,
          message: message.trim(),
          email: email.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setIsSubmitted(true);

      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage('');
        setEmail('');
        setFeedbackType('general');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes = [
    { value: 'bug' as const, label: 'Bug Report', description: 'Something isn\'t working correctly' },
    { value: 'feature' as const, label: 'Feature Request', description: 'Suggest a new feature or improvement' },
    { value: 'privacy' as const, label: 'Privacy Concern', description: 'Questions about data handling or privacy' },
    { value: 'general' as const, label: 'General Feedback', description: 'General comments or questions' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Send Feedback</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close feedback modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Thank you!</h3>
              <p className="text-gray-300">
                Your feedback has been received. We&apos;ll review it and get back to you if needed.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  What type of feedback do you have?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {feedbackTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${
                        feedbackType === type.value
                          ? 'border-blue-500 bg-blue-900/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="feedbackType"
                        value={type.value}
                        checked={feedbackType === type.value}
                        onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">{type.label}</div>
                        <div className="text-xs text-gray-400">{type.description}</div>
                      </div>
                      {feedbackType === type.value && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Please describe your feedback in detail..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  {feedbackType === 'privacy' && 'Note: We handle all privacy concerns with the utmost care and confidentiality.'}
                  {feedbackType === 'bug' && 'Please include steps to reproduce the issue if possible.'}
                  {feedbackType === 'feature' && 'Describe the feature and how it would benefit your workflow.'}
                </p>
              </div>

              {/* Email (Optional) */}
              <div>
                <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email (optional)
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Provide your email if you&apos;d like us to follow up with you.
                </p>
              </div>

              {/* Privacy Notice */}
              <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3">
                <p className="text-amber-200 text-xs">
                  <strong>Privacy:</strong> This feedback is temporary and will be processed according to our no-storage policy.
                  If you provide an email, it will only be used to respond to your feedback and then deleted.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Feedback</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
