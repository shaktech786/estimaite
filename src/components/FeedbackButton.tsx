'use client';
import { useState } from 'react';
import { FeedbackModal } from './FeedbackModal';

interface FeedbackButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

export function FeedbackButton({ variant = 'inline', className = '' }: FeedbackButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`fixed bottom-6 right-6 z-40 px-4 py-3 bg-cyan-500 text-gray-900 font-medium rounded-full shadow-lg hover:bg-cyan-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all ${className}`}
        >
          💬 Feedback
        </button>
        <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`px-4 py-2 bg-gray-700 text-gray-300 font-medium rounded-lg border border-gray-600 hover:bg-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all ${className}`}
      >
        💬 Feedback
      </button>
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
