'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';

interface FeedbackButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export function FeedbackButton({ variant = 'floating', className = '' }: FeedbackButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 z-40 ${className}`}
          aria-label="Send feedback"
          title="Send feedback"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
        <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors underline-offset-4 hover:underline ${className}`}
      >
        <MessageSquare className="h-4 w-4" />
        <span>Send Feedback</span>
      </button>
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
